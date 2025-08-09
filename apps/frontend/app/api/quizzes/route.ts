import type { NextRequest } from "next/server"

// Backend-for-Frontend proxy to your NestJS service [^2]
const BASE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4040"

export async function GET() {
    const res = await fetch(`${BASE}/quizzes`, {
        // Ensure fresh data; adjust if you want caching.
        cache: "no-store",
    })
    if (!res.ok) {
        return new Response(await res.text(), { status: res.status })
    }
    const data = await res.json()
    return Response.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const res = await fetch(`${BASE}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        return new Response(await res.text(), { status: res.status })
    }
    const data = await res.json()
    return Response.json(data, { status: 201 })
}
