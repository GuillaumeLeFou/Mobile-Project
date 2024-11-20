export interface UserData {
    pseudo: string | null;
    userId: string | null;
    image: string | null;
    exp: number | null;
    goalExp: number | null;
    niveau: number | null;
    dailyExercises: CompleteExercises | null;
    challenges: CompleteChallenge | null;
}

export interface DailyExercise {
    name: string;
    description: string;
    primary_muscle: string;
    secondary_muscles: string[];
    reps: number;
    completed: boolean;
    success: boolean;
}

export interface CompleteExercises {
    date: string;
    exercises: DailyExercise[];
}

export interface CompleteChallenge {
    date: string,
    challenges: Challenge[];
}

export interface Challenge {
    name: string;
    description: string;
    primary_muscle: string;
    secondary_muscles: string[];
    reps: number;
    completed: boolean;
    success: boolean;
    time: number;
    bonus: boolean;
    malus: boolean;
}

export interface StatusUpdate {
    completed: boolean;
    success: boolean;
}

export interface BonusMalusUpdate {
    bonus: boolean;
    malus: boolean;
}