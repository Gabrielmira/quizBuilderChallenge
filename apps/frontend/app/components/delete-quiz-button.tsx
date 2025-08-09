"use client"

import type React from "react"

import { useState } from "react"
import { Trash2 } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { deleteQuiz } from "../lib/api"

type Props = {
    id: string
    title?: string
    onDeleted?: () => void
    trigger?: React.ReactNode
}

export default function DeleteQuizButton({ id, title = "this quiz", onDeleted = () => {}, trigger }: Props) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onConfirm = async () => {
        setLoading(true)
        try {
            await deleteQuiz(id)
            toast({ title: "Quiz deleted" })
            onDeleted()
            setOpen(false)
        } catch {
            toast({ title: "Failed to delete", description: "Try again later.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {trigger ?? (
                    <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete quiz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {title}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={loading} className="bg-destructive hover:bg-destructive/90">
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
