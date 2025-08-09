import type { Quiz, Question } from "@repo/types"

const baseUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 4040}`)

const INTERNAL = {
    quizzes: `${baseUrl}/api/quizzes`,
    quiz: (id: string) => `${baseUrl}/api/quizzes/${id}`,
}

export type CreateQuizPayload = {
    title: string
    questions: Question[]
}

export async function fetchQuizzes(): Promise<
    Array<Pick<Quiz, "id" | "title"> & { questionCount?: number; questions?: Question[]; questionsCount?: number }>
> {
    const res = await fetch(INTERNAL.quizzes, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch quizzes")
    return res.json() as Promise<any>
}

export async function fetchQuizById(id: string): Promise<Quiz> {
    if (!id) throw new Error("ID é obrigatório")
    const url = INTERNAL.quiz(encodeURIComponent(id))
    console.log("Fetching quiz from:", url)

    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to fetch quiz (${res.status})`)
    return res.json() as Promise<Quiz>
}

export async function createQuiz(input: CreateQuizPayload): Promise<Quiz> {
    const res = await fetch(INTERNAL.quizzes, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    })
    if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || "Failed to create quiz")
    }
    return res.json() as Promise<Quiz>
}

// @ts-ignore
export async function deleteQuiz(id: string): Promise<void> {
    const res = await fetch(INTERNAL.quiz(encodeURIComponent(id)), { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete quiz")
}
