import { notFound } from "next/navigation"
import { Check, Dot, ListChecks, Text, ToggleRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fetchQuizById } from "../../lib/api"
import { QuestionType, type CheckboxQuestion, type InputQuestion, type BooleanQuestion } from '@repo/types'
import AppHeader from "../../components/app-header"

type Props = {
    params: Promise<{ id: string }>
}

export default async function QuizDetailPage(props: Props) {
    const { id } = await props.params
    const quiz = await fetchQuizById(id).catch(() => null)
    console.log("quiz", quiz);
    if (!quiz) notFound()

    return (
        <div className="min-h-screen bg-muted/30">
            <AppHeader />
            <main className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
                    <p className="text-muted-foreground">{quiz.questions?.length ?? 0} questions</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Questions</CardTitle>
                        <CardDescription>Rendered read-only (for structure and review).</CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="space-y-6">
                        {quiz.questions.map((q, i) => {
                            if (q.type === QuestionType.BOOLEAN) {
                                const bq = q as BooleanQuestion
                                return (
                                    <div key={q.id} className="rounded-lg border p-4">
                                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <ToggleRight className="h-4 w-4" />
                                            <span>Boolean</span>
                                            <Dot className="h-4 w-4" />
                                            <span>Required: {q.required ? "Yes" : "No"}</span>
                                        </div>
                                        <h3 className="font-semibold">
                                            {i + 1}. {q.title}
                                        </h3>
                                        <div className="mt-3 flex gap-2">
                      <span
                          className={`rounded-full border px-3 py-1 text-sm ${bq.correctAnswer ? "bg-emerald-50" : ""}`}
                      >
                        True {bq.correctAnswer ? <Check className="ml-1 inline h-4 w-4 text-emerald-600" /> : null}
                      </span>
                                            <span
                                                className={`rounded-full border px-3 py-1 text-sm ${!bq.correctAnswer ? "bg-emerald-50" : ""}`}
                                            >
                        False {!bq.correctAnswer ? <Check className="ml-1 inline h-4 w-4 text-emerald-600" /> : null}
                      </span>
                                        </div>
                                    </div>
                                )
                            }

                            if (q.type === QuestionType.INPUT) {
                                const iq = q as InputQuestion
                                return (
                                    <div key={q.id} className="rounded-lg border p-4">
                                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Text className="h-4 w-4" />
                                            <span>Short Text</span>
                                            <Dot className="h-4 w-4" />
                                            <span>Required: {q.required ? "Yes" : "No"}</span>
                                        </div>
                                        <h3 className="font-semibold">
                                            {i + 1}. {q.title}
                                        </h3>
                                        <p className="mt-3 text-sm">
                                            Correct answer: <span className="font-mono">{iq.correctAnswer}</span>
                                        </p>
                                        {iq.placeholder ? (
                                            <p className="text-xs text-muted-foreground">Placeholder: {iq.placeholder}</p>
                                        ) : null}
                                        {typeof iq.maxLength === "number" ? (
                                            <p className="text-xs text-muted-foreground">Max length: {iq.maxLength}</p>
                                        ) : null}
                                    </div>
                                )
                            }

                            const cq = q as CheckboxQuestion
                            return (
                                <div key={q.id} className="rounded-lg border p-4">
                                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <ListChecks className="h-4 w-4" />
                                        <span>Checkbox</span>
                                        <Dot className="h-4 w-4" />
                                        <span>Required: {q.required ? "Yes" : "No"}</span>
                                        <Dot className="h-4 w-4" />
                                        <span>{cq.allowMultiple ? "Multiple answers allowed" : "Single answer"}</span>
                                    </div>
                                    <h3 className="font-semibold">
                                        {i + 1}. {q.title}
                                    </h3>
                                    <ul className="mt-3 grid gap-2">
                                        {cq.options.map((o) => {
                                            const correct = cq.correctAnswer.includes(o.id)
                                            return (
                                                <li
                                                    key={o.id}
                                                    className={`flex items-center justify-between rounded border p-2 text-sm ${correct ? "bg-emerald-50" : ""}`}
                                                >
                                                    <span>{o.text}</span>
                                                    {correct ? <Check className="h-4 w-4 text-emerald-600" /> : null}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
