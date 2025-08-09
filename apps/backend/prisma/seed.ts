import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    await prisma.quiz.create({
        data: {
            title: "Sample Quiz",
            questions: JSON.stringify([
                { id: "q1", title: "Is the sky blue?", type: "BOOLEAN", correctAnswer: true, required: true },
                { id: "q2", title: "Capital of France?", type: "INPUT", correctAnswer: "Paris", required: true }
            ])
        }
    })
}

main()
    .then(() => {
        console.log("✅ Seed completed")
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
