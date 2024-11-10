const getTimeChallenge = (level: number) => {
    const DECREASE_TIME = 5;
    const BASE_TIME = 300;

    return BASE_TIME - (DECREASE_TIME * (level - 1));
}

export default getTimeChallenge;