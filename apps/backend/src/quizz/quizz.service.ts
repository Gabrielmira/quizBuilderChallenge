import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { v4 as uuidv4 } from 'uuid';
import { QuestionType, Question, Quiz } from '@repo/types';
import { Prisma } from '@prisma/client'

@Injectable()
export class QuizzService {
  constructor(private prisma: PrismaService) {}

  private ensureValidQuestionShape(q: any): Record<string, any>{
    if (!q || typeof q.type !== 'string') {
      throw new BadRequestException('Each question must have a "type" field.');
    }
    const id = (q.id as string) ?? uuidv4();
    const base = { id, title: (q.title as string) ?? '', required: !!q.required };

    switch (q.type) {
      case QuestionType.BOOLEAN:
        if (typeof q.correctAnswer !== 'boolean') throw new BadRequestException('Boolean question requires boolean correctAnswer.');
        return { ...base, type: QuestionType.BOOLEAN, correctAnswer: q.correctAnswer };

      case QuestionType.INPUT:
        if (typeof q.correctAnswer !== 'string') throw new BadRequestException('Input question requires string correctAnswer.');
        return { ...base, type: QuestionType.INPUT, correctAnswer: String(q.correctAnswer).trim() };

      case QuestionType.CHECKBOX:
        if (!Array.isArray(q.options) || q.options.length === 0) throw new BadRequestException('Checkbox requires options array.');
        if (!Array.isArray(q.correctAnswer)) throw new BadRequestException('Checkbox requires correctAnswer array.');
        const options = q.options.map((opt: any) => ({
          id: (opt.id as string) ?? uuidv4(),
          text: String(opt.text ?? ''),
        }));
        const optionIds = options.map(o => o.id);
        (q.correctAnswer as string[]).forEach(cid => {
          if (!optionIds.includes(cid)) throw new BadRequestException(`Invalid correctAnswer option id: ${cid}`);
        });
        return { ...base, type: QuestionType.CHECKBOX, options, correctAnswer: q.correctAnswer, allowMultiple: !!q.allowMultiple };

      default:
        throw new BadRequestException(`Unknown question type: ${q.type}`);
    }
  }

  async create(dto: CreateQuizzDto) {
    if (!dto.title) throw new BadRequestException('title is required');
    if (!Array.isArray(dto.questions)) throw new BadRequestException('questions must be an array');

    const questions = dto.questions.map(q => this.ensureValidQuestionShape(q));

    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        questions,
      },
    });
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      select: { id: true, title: true, questions: true },
    });
    return quizzes.map(q => ({
      id: q.id,
      title: q.title,
      numberOfQuestions: Array.isArray(q.questions) ? q.questions.length : 0,
    }));
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async update(id: string, dto: UpdateQuizzDto) {
    const existing = await this.prisma.quiz.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Quiz not found');

    let updatedQuestions = existing.questions;
    if (Array.isArray(dto.questions)) {
      updatedQuestions = dto.questions.map(q => this.ensureValidQuestionShape(q));
    }

    return this.prisma.quiz.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        questions: updatedQuestions as any,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.quiz.delete({ where: { id } });
    return { success: true };
  }
}
