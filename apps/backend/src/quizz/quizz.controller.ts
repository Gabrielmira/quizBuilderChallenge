import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';

@Controller('quizzes')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  @Post()
  create(@Body() dto: CreateQuizzDto) {
    return this.quizzService.create(dto);
  }

  @Get()
  findAll() {
    return this.quizzService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuizzDto) {
    return this.quizzService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzService.remove(id);
  }
}
