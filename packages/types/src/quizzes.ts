export type UUID = string;

export enum QuestionType {
    BOOLEAN = 'BOOLEAN',
    INPUT = 'INPUT',
    CHECKBOX = 'CHECKBOX',
}

interface BaseQuestion {
    id: UUID;
    title: string;
    type: QuestionType;
    required?: boolean;
    // metadata para extensões futuras
    metadata?: Record<string, unknown>;
}

/** Boolean (True / False) */
export interface BooleanQuestion extends BaseQuestion {
    type: QuestionType.BOOLEAN;
    correctAnswer: boolean;
}

/** Short text input answer */
export interface InputQuestion extends BaseQuestion {
    type: QuestionType.INPUT;
    correctAnswer: string; // normalized (lowercase/trim) se quiser tolerância
    placeholder?: string;
    maxLength?: number;
}

/** Checkbox / multiple-choice */
export interface CheckboxOption {
    id: UUID;
    text: string;
}

export interface CheckboxQuestion extends BaseQuestion {
    type: QuestionType.CHECKBOX;
    options: CheckboxOption[];        // list of options
    correctAnswer: UUID[];           // array of option ids that are correct
    allowMultiple?: boolean;         // if false, expect a single element in correctAnswer
}

export type Question = BooleanQuestion | InputQuestion | CheckboxQuestion;

export interface Quiz {
    id: UUID;
    title: string;
    questions: Question[];
    createdAt?: string;
    updatedAt?: string;
}
