export function timeToMilliseconds({ hours = 0, minutes = 0, seconds = 0, milliseconds = 0 }) {
    const hoursToMs = hours * 60 * 60 * 1000;
    const minutesToMs = minutes * 60 * 1000;
    const secondsToMs = seconds * 1000;
    
    return hoursToMs + minutesToMs + secondsToMs + milliseconds;
}

export function getRandomQuestion(questions) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}