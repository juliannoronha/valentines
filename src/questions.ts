export interface Question {
    question: string;
    answers: string[];
}

export const questions: Question[] = [
    {
        question: "What do you think I love most about you?",
        answers: ["Your smile 😊", "Your laugh 😂", "Everything 💕", "My good taste 😎"],
    },
    {
        question: "Pick our love song",
        answers: ["Perfect - Ed Sheeran 🎵", "All of Me - John Legend 🎶", "Lucky - Jason Mraz ☘️", "We don't need one, we ARE the song 🎤"],
    },
    {
        question: "What's our best memory together?",
        answers: ["Our first date 🌹", "That random adventure 🗺️", "Every moment with you 💖", "The one we haven't made yet 🔮"],
    },
    {
        question: "On a scale of 1-10, how cute are we?",
        answers: ["10 💯", "100 🔥", "Off the charts 📈", "All of the above 💝"],
    },
];
