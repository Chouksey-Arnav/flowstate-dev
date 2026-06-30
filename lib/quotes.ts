export const QUOTES: string[] = [
  "Stop thinking. Start doing.",
  "Discipline is choosing what you want most over what you want now.",
  "The task you're avoiding is the one that matters most.",
  "Done is the engine of more.",
  "Motivation gets you started. Momentum keeps you going.",
  "You don't need more time, you need a decision.",
  "Small actions, repeated daily, beat big plans you never start.",
  "The work won't feel ready. Start anyway.",
  "Every minute you wait is a minute you don't get back.",
  "Focus is a muscle. Today is a rep.",
  "Future you is built by what current you does right now.",
  "Clarity comes from action, not thought.",
  "You're one focused hour away from momentum.",
  "Progress beats perfect every single time.",
  "The hardest part is the first five minutes. Start there.",
  "Busy is not the same as productive. Choose direction.",
  "What gets scheduled gets done.",
  "Your future is a function of your habits, not your intentions.",
  "Don't wait for motivation. Build the system instead.",
  "Today's effort is tomorrow's evidence.",
];

export function getHourlyQuote(date: Date = new Date()): string {
  const hourIndex = date.getHours() % QUOTES.length;
  return QUOTES[hourIndex];
}

export const COMPLETION_LINES: string[] = [
  "Done. That's momentum, not luck.",
  "One less thing in your head. Keep moving.",
  "That's the work avoiding-you used to win.",
  "Shipped. Future you says thanks.",
  "Streak protected. Don't stop now.",
  "Proof you can do hard things today.",
  "Nailed it. Pick the next one.",
  "That's how the list gets shorter — one real decision at a time.",
  "Momentum unlocked. Ride it into the next task.",
  "You showed up. That's the whole game.",
];

export function getRandomCompletionLine(): string {
  return COMPLETION_LINES[Math.floor(Math.random() * COMPLETION_LINES.length)];
}
