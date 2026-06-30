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
  "You already know what to do. Go do it.",
  "Procrastination is just fear wearing a to-do list.",
  "Read less about productivity. Be more productive.",
  "The version of you that already started is waiting for you to catch up.",
  "There is no perfect moment. There's just this one.",
  "Comfort is the enemy of growth — pick the harder task first.",
  "You don't rise to your goals, you fall to your systems. Build one now.",
  "Nobody is coming to do this for you.",
  "Every day you delay is a vote for staying the same.",
  "The task is smaller than the dread you've built around it.",
  "Action kills anxiety. Move.",
  "Excuses are just lies you've rehearsed.",
  "Five minutes of real work beats five hours of planning to work.",
  "You won't feel ready. Ready is a myth. Start anyway.",
  "Today is the only day you actually have.",
  "Discomfort now is freedom later.",
  "Stop negotiating with yourself. Just begin.",
  "The list doesn't shrink by thinking about it.",
  "Future you is watching what you do in the next ten minutes.",
  "Average plans, executed today, beat perfect plans executed never.",
  "If it takes two minutes, you have no excuse not to start it now.",
  "Resistance is loudest right before the breakthrough.",
  "You can't think your way out of procrastination — only act your way out.",
  "Every rep counts, even the ugly ones.",
  "Done badly today beats done perfectly never.",
  "Your only job right now: the next five minutes.",
  "Stalling is a decision. Choose differently.",
  "The work doesn't care how you feel about it.",
  "Win the morning, win the day.",
  "One task, fully finished, beats five tasks half-started.",
  "Discipline weighs ounces. Regret weighs tons.",
  "Nothing changes if nothing starts.",
  "You're not stuck. You're just stalling.",
  "Open the task. Do one line. Momentum follows.",
  "The version of today you're avoiding is the version that compounds.",
  "Slow progress is still progress. No progress is a choice.",
  "Stop scrolling. Start shipping.",
  "You don't need a better plan. You need to start the one you have.",
  "Procrastination is debt you pay with interest, in panic, later.",
  "Today's small win is tomorrow's evidence you can trust yourself.",
  "The longer you wait, the heavier it gets. Move now while it's light.",
  "Your future self has no patience for your current excuses.",
  "Action is the antidote to overthinking.",
  "It will never be a more convenient time than right now.",
  "You feel behind because you are standing still. Move.",
  "Done is a decision, not a feeling.",
  "Get ugly progress today. Polish it tomorrow.",
  "Stop researching how to start. Start.",
  "The dread fades the second you begin.",
  "Trust is built with yourself first — keep the promise you made to start today.",
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
  "That one's off your back for good.",
  "Receipts don't lie — you did the thing.",
  "Another brick laid. Keep building.",
  "That used to live rent-free in your head. Evicted.",
  "You bet on yourself and won. Again.",
  "Future you just got a little easier day.",
  "That's discipline, not luck.",
  "Less weight on your shoulders. Keep walking.",
  "You turned a thought into a result.",
  "Confidence is built exactly like that.",
  "Stacking wins. Don't break the chain.",
  "That's one less thing you'll dread tomorrow.",
  "Real progress, not performative busyness.",
  "Today you out-worked yesterday's excuses.",
  "You said you would. You did. That matters.",
  "That's what consistency looks like up close.",
  "The avoided thing is now the finished thing.",
  "Small win, real momentum.",
  "Keep this energy — it compounds.",
  "You just proved your own point: you can do hard things.",
];

export function getRandomCompletionLine(): string {
  return COMPLETION_LINES[Math.floor(Math.random() * COMPLETION_LINES.length)];
}

export const AVOIDANCE_QUOTES: string[] = [
  "You've been circling this task for days. Today or never.",
  "That task isn't getting easier by waiting — it's getting heavier.",
  "The thing you keep skipping is the thing that's actually blocking you.",
  "Every time you click 'show another,' that task gets a little more expensive.",
  "You can't outrun a task. You can only finally start it.",
  "The avoidance is costing more than the task ever would.",
  "Stop scheduling it for 'later.' Later is where good intentions go to die.",
  "This one's been on the list long enough to have its own zip code. Finish it.",
  "You don't need permission to do the hard task first.",
  "The longer it sits, the bigger it looks. It's not actually bigger.",
  "That task is the reason your list feels heavy. Clear it.",
  "Dodging it again? That's a pattern, not a one-off.",
  "Nothing about tomorrow makes this task easier than today does.",
  "You're not too busy — you're avoiding something specific. Be honest about it.",
  "The discomfort of starting is smaller than the discomfort of still avoiding it next week.",
  "This is the task quietly draining your focus on everything else.",
  "If it's still here tomorrow, it gets worse, not better.",
  "You already know which task this is about. Open it.",
  "Procrastinated tasks don't disappear. They just wait, and grow interest.",
  "Pick the task you're dreading. That's today's real priority.",
];

export const STREAK_RISK_QUOTES: string[] = [
  "The day isn't over, but it's getting late. One task keeps the streak alive.",
  "Don't let a good streak die from a slow afternoon.",
  "You've shown up before. Show up again — right now.",
  "One done task stands between today and a broken streak.",
  "The clock is the only thing actually working against you right now.",
  "A zero day is a choice you're still in time to avoid.",
  "Future you doesn't care it was a 'busy day' — only that you showed up.",
  "Streaks aren't broken by hard days. They're broken by skipped ones.",
  "You don't need a perfect day. You need one finished task before it ends.",
  "It's not too late. It's exactly late enough to matter.",
  "Protect the streak — it's proof you keep your word to yourself.",
  "Today still counts. Make it count.",
  "The bar is one task. You can clear that.",
  "Don't let today be the exception that becomes the new habit.",
  "Close the day with a win, not a maybe.",
];

interface DashboardQuoteContext {
  hasAvoidedTask?: boolean;
  streakAtRisk?: boolean;
}

function randomFrom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Picks the most relevant nudge for right now — a task you're actively
 * avoiding outranks a streak warning, which outranks general motivation.
 */
export function getDashboardQuote(ctx: DashboardQuoteContext = {}): string {
  if (ctx.hasAvoidedTask) return randomFrom(AVOIDANCE_QUOTES);
  if (ctx.streakAtRisk) return randomFrom(STREAK_RISK_QUOTES);
  return randomFrom(QUOTES);
}
