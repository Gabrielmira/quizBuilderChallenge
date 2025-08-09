"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { ChevronDown, ListChecks, Text, ToggleRight } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createQuiz } from "../lib/api"
import { normalizeAnswer } from "../lib/normalizers"
import {
    type BooleanQuestion,
    type CheckboxOption,
    type CheckboxQuestion,
    type InputQuestion,
    QuestionType,
    type Question,
} from "@repo/types"
import AppHeader from "../components/app-header"
import QuestionEditor from "../components/question-editor"

const titleSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
})

export default function CreateQuizPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [title, setTitle] = useState("")
    const [questions, setQuestions] = useState<Question[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addQuestion = (type: QuestionType) => {
        const base = {
            id: uuidv4(),
            title: "",
            type,
            required: false,
            metadata: {},
        } as const

        let q: Question
        if (type === QuestionType.BOOLEAN) {
            q = { ...base, type: QuestionType.BOOLEAN, correctAnswer: true } as BooleanQuestion
        } else if (type === QuestionType.INPUT) {
            q = {
                ...base,
                type: QuestionType.INPUT,
                correctAnswer: "",
                placeholder: "Type the correct answer",
                maxLength: 200,
            } as InputQuestion
        } else {
            const o1: CheckboxOption = { id: uuidv4(), text: "Option 1" }
            const o2: CheckboxOption = { id: uuidv4(), text: "Option 2" }
            q = {
                ...base,
                type: QuestionType.CHECKBOX,
                options: [o1, o2],
                correctAnswer: [],
                allowMultiple: true,
            } as CheckboxQuestion
        }
        setQuestions((prev) => [...prev, q])
    }

    const updateQuestion = (id: string, patch: Partial<Question>) => {
        setQuestions((prev) => prev.map((q) => (q.id === id ? ({ ...q, ...patch } as Question) : q)))
    }

    const removeQuestion = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id))
    }

    const validateQuestions = (): { ok: boolean; message?: string } => {
        if (questions.length === 0) return { ok: false, message: "Add at least one question." }
        for (const q of questions) {
            if (!q.title.trim()) return { ok: false, message: "Each question must have a title." }

            if (q.type === QuestionType.INPUT) {
                const iq = q as InputQuestion
                if (!iq.correctAnswer.trim()) return { ok: false, message: "Input questions need a correct answer." }
            }

            if (q.type === QuestionType.CHECKBOX) {
                const cq = q as CheckboxQuestion
                if (!cq.options || cq.options.length < 2) {
                    return { ok: false, message: "Checkbox questions need at least 2 options." }
                }
                const hasCorrect = Array.isArray(cq.correctAnswer) && cq.correctAnswer.length > 0
                if (!hasCorrect) return { ok: false, message: "Checkbox questions need one or more correct options." }
                if (cq.allowMultiple === false && cq.correctAnswer.length !== 1) {
                    return { ok: false, message: "When multiple selection is disabled, select exactly one correct option." }
                }
                const optionIds = new Set(cq.options.map((o) => o.id))
                if (!cq.correctAnswer.every((id) => optionIds.has(id))) {
                    return { ok: false, message: "Correct answers must reference existing options." }
                }
            }
        }
        return { ok: true }
    }

    const onSubmit = async () => {
        try {
            titleSchema.parse({ title })
        } catch (err: unknown) {
            const message = err instanceof z.ZodError ? err.issues[0]?.message : "Invalid title"
            toast({ title: "Invalid title", description: message, variant: "destructive" })
            return
        }

        const validation = validateQuestions()
        if (!validation.ok) {
            toast({ title: "Invalid quiz", description: validation.message, variant: "destructive" })
            return
        }

        const normalized: Question[] = questions.map((q) => {
            if (q.type === QuestionType.INPUT) {
                const iq = q as InputQuestion
                return { ...iq, correctAnswer: normalizeAnswer(iq.correctAnswer) }
            }
            if (q.type === QuestionType.CHECKBOX) {
                const cq = q as CheckboxQuestion
                return {
                    ...cq,
                    options: cq.options.map((o) => ({ ...o, text: o.text.trim() })),
                    correctAnswer: [...cq.correctAnswer],
                }
            }
            return q
        })

        setIsSubmitting(true)
        try {
            // Pass only the expected fields to the API
            const created = await createQuiz({ title: title.trim(), questions: normalized })
            toast({
                title: "Quiz created",
                description: "Your quiz was saved successfully.",
            })
            router.push(`/quizzes/${created.id}`)
        } catch (e) {
            toast({
                title: "Failed to create quiz",
                description: "Please verify your backend and try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <AppHeader />
            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
                    <p className="text-muted-foreground">Build your quiz by adding different question types.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Details</CardTitle>
                        <CardDescription>Set a title and add questions below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Quiz Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., JavaScript Fundamentals"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={200}
                                aria-describedby="title-hint"
                            />
                            <p id="title-hint" className="text-xs text-muted-foreground">
                                A descriptive title helps you find your quiz later.
                            </p>
                        </div>

                        <Separator />

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-muted-foreground">Add question:</span>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addQuestion(QuestionType.BOOLEAN)}
                                    className="gap-2"
                                >
                                    <ToggleRight className="h-4 w-4" />
                                    Boolean
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addQuestion(QuestionType.INPUT)}
                                    className="gap-2"
                                >
                                    <Text className="h-4 w-4" />
                                    Input
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addQuestion(QuestionType.CHECKBOX)}
                                    className="gap-2"
                                >
                                    <ListChecks className="h-4 w-4" />
                                    Checkbox
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {questions.length === 0 ? (
                                <div className="rounded-lg border bg-card text-card-foreground p-6 text-center">
                                    <p className="text-muted-foreground">
                                        No questions yet. Use the buttons above to add your first question.
                                    </p>
                                </div>
                            ) : null}

                            {questions.map((q, index) => (
                                <QuestionEditor
                                    key={q.id}
                                    index={index}
                                    question={q}
                                    onChange={(patch) => updateQuestion(q.id, patch)}
                                    onRemove={() => removeQuestion(q.id)}
                                />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-end gap-3">
                        <Button variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                        <Button onClick={onSubmit} disabled={isSubmitting} className="gap-2" aria-busy={isSubmitting}>
                            {isSubmitting ? <ChevronDown className="h-4 w-4 animate-bounce" /> : null}
                            Save Quiz
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}
