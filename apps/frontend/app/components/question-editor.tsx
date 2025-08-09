"use client"

import { Fragment } from "react"
import { v4 as uuidv4 } from "uuid"
import { ListChecks, Minus, Plus, Text, ToggleRight, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
    type BooleanQuestion,
    type CheckboxOption,
    type CheckboxQuestion,
    type InputQuestion,
    QuestionType,
    type Question,
} from '@repo/types'

type Props = {
    index?: number
    question: Question
    onChange?: (patch: Partial<Question>) => void
    onRemove?: () => void
}

export default function QuestionEditor({ index = 0, question, onChange = () => {}, onRemove = () => {} }: Props) {
    const baseHeader = (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {question.type === QuestionType.BOOLEAN ? (
                    <span className="inline-flex items-center gap-1">
            <ToggleRight className="h-4 w-4" /> Boolean
          </span>
                ) : question.type === QuestionType.INPUT ? (
                    <span className="inline-flex items-center gap-1">
            <Text className="h-4 w-4" /> Short Text
          </span>
                ) : (
                    <span className="inline-flex items-center gap-1">
            <ListChecks className="h-4 w-4" /> Checkbox
          </span>
                )}
                <span>•</span>
                <span>Question {index + 1}</span>
            </div>
            <CardTitle className="text-base">
                <Input
                    value={question.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="Type the question prompt"
                />
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
                <Label htmlFor={`required-${question.id}`} className="cursor-pointer text-xs">
                    Required
                </Label>
                <Switch
                    id={`required-${question.id}`}
                    checked={!!question.required}
                    onCheckedChange={(checked) => onChange({ required: !!checked })}
                />
            </CardDescription>
        </div>
    )

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                {baseHeader}
                <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove question">
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {question.type === QuestionType.BOOLEAN ? (
                    <BooleanEditor question={question as BooleanQuestion} onChange={onChange} />
                ) : question.type === QuestionType.INPUT ? (
                    <InputEditor question={question as InputQuestion} onChange={onChange} />
                ) : (
                    <CheckboxEditor question={question as CheckboxQuestion} onChange={onChange} />
                )}
            </CardContent>
        </Card>
    )
}

function BooleanEditor({
                           question,
                           onChange,
                       }: {
    question: BooleanQuestion
    onChange: (patch: Partial<BooleanQuestion>) => void
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Label className="text-sm">Correct answer:</Label>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant={question.correctAnswer ? "default" : "outline"}
                    onClick={() => onChange({ correctAnswer: true })}
                    size="sm"
                >
                    True
                </Button>
                <Button
                    type="button"
                    variant={!question.correctAnswer ? "default" : "outline"}
                    onClick={() => onChange({ correctAnswer: false })}
                    size="sm"
                >
                    False
                </Button>
            </div>
        </div>
    )
}

function InputEditor({
                         question,
                         onChange,
                     }: {
    question: InputQuestion
    onChange: (patch: Partial<InputQuestion>) => void
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor={`correct-${question.id}`}>Correct answer</Label>
                <Input
                    id={`correct-${question.id}`}
                    value={question.correctAnswer}
                    onChange={(e) => onChange({ correctAnswer: e.target.value })}
                    placeholder="e.g., closures"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor={`placeholder-${question.id}`}>Placeholder (optional)</Label>
                <Input
                    id={`placeholder-${question.id}`}
                    value={question.placeholder ?? ""}
                    onChange={(e) => onChange({ placeholder: e.target.value })}
                    placeholder="Enter your answer"
                />
            </div>
            <div className="grid gap-2 md:max-w-xs">
                <Label htmlFor={`maxlength-${question.id}`}>Max length</Label>
                <Input
                    id={`maxlength-${question.id}`}
                    type="number"
                    min={1}
                    max={2000}
                    value={typeof question.maxLength === "number" ? question.maxLength : ""}
                    onChange={(e) => onChange({ maxLength: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="200"
                />
            </div>
        </div>
    )
}

function CheckboxEditor({
                            question,
                            onChange,
                        }: {
    question: CheckboxQuestion
    onChange: (patch: Partial<CheckboxQuestion>) => void
}) {
    const toggleCorrect = (id: string) => {
        const isSelected = question.correctAnswer.includes(id)
        const next = isSelected ? question.correctAnswer.filter((x) => x !== id) : [...question.correctAnswer, id]
        let normalized = next
        if (question.allowMultiple === false && next.length > 1) {
            // @ts-ignore
            normalized = [next[next.length - 1]]
        }
        onChange({ correctAnswer: normalized })
    }

    const addOption = () => {
        const opt: CheckboxOption = { id: uuidv4(), text: `Option ${question.options.length + 1}` }
        onChange({ options: [...question.options, opt] })
    }

    const removeOption = (id: string) => {
        const keep = question.options.filter((o) => o.id !== id)
        const corrected = question.correctAnswer.filter((x) => x !== id)
        onChange({ options: keep, correctAnswer: corrected })
    }

    const updateOption = (id: string, text: string) => {
        const opts = question.options.map((o) => (o.id === id ? { ...o, text } : o))
        onChange({ options: opts })
    }

    return (
        <Fragment>
            <div className="flex items-center gap-3">
                <Label htmlFor={`mult-${question.id}`} className="text-sm">
                    Allow multiple answers
                </Label>
                <Switch
                    id={`mult-${question.id}`}
                    checked={question.allowMultiple ?? true}
                    onCheckedChange={(checked) => {
                        const allow = !!checked
                        let corrected = question.correctAnswer
                        if (!allow && corrected.length > 1) {
                            // @ts-ignore
                            corrected = [corrected[corrected.length - 1]]
                        }
                        onChange({ allowMultiple: allow, correctAnswer: corrected })
                    }}
                />
            </div>

            <div className="grid gap-3">
                <Label className="text-sm">Options</Label>
                <div className="grid gap-2">
                    {question.options.map((o, idx) => {
                        const isCorrect = question.correctAnswer.includes(o.id)
                        return (
                            <div
                                key={o.id}
                                className={cn("grid items-center gap-2 rounded-md border p-2 md:grid-cols-[1.5rem_1fr_auto]")}
                            >
                                <div className="flex items-center justify-center">
                                    <Checkbox
                                        checked={isCorrect}
                                        onCheckedChange={() => toggleCorrect(o.id)}
                                        aria-label="Mark as correct"
                                    />
                                </div>
                                <Input
                                    value={o.text}
                                    onChange={(e) => updateOption(o.id, e.target.value)}
                                    placeholder={`Option ${idx + 1}`}
                                />
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(o.id)}
                                        aria-label="Remove option"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-2 bg-transparent">
                        <Plus className="h-4 w-4" />
                        Add option
                    </Button>
                </div>
            </div>
            <div className="grid gap-2">
                <Label className="text-sm">Explanation / Notes (optional)</Label>
                <Textarea
                    placeholder="Any extra notes about this question (kept in metadata)."
                    value={(question.metadata?.notes as string) || ""}
                    onChange={(e) => onChange({ metadata: { ...(question.metadata || {}), notes: e.target.value } as any })}
                />
            </div>
        </Fragment>
    )
}
