"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"
import { Loader2, PlusCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { fetchQuizzes } from "../lib/api"
import type { CheckboxQuestion } from '@repo/types'
import AppHeader from "../components/app-header"
import DeleteQuizButton from "../components/delete-quiz-button"

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<CheckboxQuestion[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, startRefresh] = useTransition()
    const { toast } = useToast()

    const load = async () => {
        setIsLoading(true)
        try {
            const data = await fetchQuizzes()
            setQuizzes(data)
        } catch (e) {
            toast({
                title: "Failed to load quizzes",
                description: "Please check your backend is running and try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDeleted = (id: string) => {
        setQuizzes((prev) => (prev ? prev.filter((q) => q.id !== id) : prev))
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <AppHeader />
            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
                        <p className="text-muted-foreground">Browse, open, or delete your quizzes.</p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/create">
                            <PlusCircle className="h-4 w-4" />
                            Create Quiz
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>All Quizzes</CardTitle>
                            <CardDescription>List of all quizzes returned from your backend.</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startRefresh(load)}
                            aria-label="Refresh"
                            disabled={isLoading || isRefreshing}
                        >
                            {isRefreshing || isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Refresh
                        </Button>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        {isLoading ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-3">
                                        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                                        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                                        <div className="h-8 w-full animate-pulse rounded bg-muted" />
                                    </div>
                                ))}
                            </div>
                        ) : quizzes && quizzes.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {quizzes.map((q) => {
                                    const count =
                                        typeof (q as any).questionCount === "number"
                                            ? (q as any).questionCount
                                            : Array.isArray((q as any).questions)
                                                ? (q as any).questions.length
                                                : ((q as any).questionsCount ?? 0)

                                    return (
                                        <Card key={q.id} className="group relative overflow-hidden">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="line-clamp-2">{q.title}</CardTitle>
                                                <CardDescription>
                                                    {count} {count === 1 ? "question" : "questions"}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent />
                                            <CardFooter className="flex items-center justify-between">
                                                <Button asChild variant="secondary" size="sm">
                                                    <Link href={`/quizzes/${q.id}`}>Open</Link>
                                                </Button>

                                                <DeleteQuizButton
                                                    id={q.id}
                                                    title={q.title}
                                                    onDeleted={() => handleDeleted(q.id)}
                                                    trigger={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Delete ${q.title}`}
                                                            className="opacity-70 hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                />
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 py-12">
                                <div className="rounded-full border p-4">
                                    <PlusCircle className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold">No quizzes yet</h2>
                                    <p className="text-muted-foreground">Create your first quiz to get started.</p>
                                </div>
                                <Button asChild>
                                    <Link href="/create">Create a Quiz</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
