import type { NextRequest } from "next/server"

// Backend-for-Frontend proxy to your NestJS service [^2]
const BASE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4040"

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
    const { id } = await params
    const res = await fetch(`${BASE}/quizzes/${id}`, { cache: "no-store" })
    if (!res.ok) {
        return new Response(await res.text(), { status: res.status })
    }
    const data = await res.json()
    return Response.json(data)
}

export async function DELETE(_: NextRequest, { params }: Params) {
    const { id } = await params
    const res = await fetch(`${BASE}/quizzes/${id}`, { method: "DELETE" })
    if (!res.ok) {
        return new Response(await res.text(), { status: res.status })
    }
    // NestJS might return 200/204; we normalize to 204
    return new Response(null, { status: 204 })
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const { id } = await params
    const body = await req.json()
    const res = await fetch(`${BASE}/quizzes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        return new Response(await res.text(), { status: res.status })
    }
    const data = await res.json()
    return Response.json(data)
}
