// components/calculOfReps.tsx
const getNumberOfReps = (level: number) => {
    const INCREASE_REPS = 5;
    const BASE_REPS = 10;

    return BASE_REPS + (INCREASE_REPS * (level - 1));
}

export default getNumberOfReps;