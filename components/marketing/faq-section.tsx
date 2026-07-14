const FAQS = [
  {
    question: "What is Flowstate?",
    answer:
      "Flowstate is a free, open-source productivity tool that helps you reach a flow state and get real work done. It combines a task manager, a drift-free focus timer, habit tracking, and stats into one minimalist developer planner — no paywall, no ads, no tracking.",
  },
  {
    question: "Why use an open-source productivity tool?",
    answer:
      "An open-source productivity tool like Flowstate gives you full transparency, no vendor lock-in, and the freedom to self-host or modify it. Your task data stays yours, the code is auditable on GitHub, and the MIT license means it's free to use, fork, and extend forever.",
  },
  {
    question: "Is Flowstate free to use?",
    answer:
      "Yes. Flowstate is completely free and MIT-licensed. There's no paywall, no premium tier, and no ads. Clone the repository, run it locally, or use the hosted version — every feature is available to everyone.",
  },
  {
    question: "What makes Flowstate a minimalist developer planner?",
    answer:
      "Flowstate strips away clutter and focuses on the essentials developers actually need: a fast task list, a distraction-free Pomodoro focus timer, habit streaks, and clean stats — all in a dark, keyboard-friendly interface built for daily use.",
  },
  {
    question: "How does the flow state task manager work?",
    answer:
      "Flowstate's task manager scores avoidance, surfaces the task you keep dodging, and pairs it with a focus timer session. Completing tasks earns XP, builds streaks, and keeps you in a productive loop — capture, focus, track, repeat.",
  },
  {
    question: "Can I self-host Flowstate?",
    answer:
      "Yes. Flowstate is built in the open and designed to be self-hosted. Clone the repo, run npm install and npm run dev, and you have your own private instance of this open-source productivity tool running locally in minutes.",
  },
];

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
          FAQ
        </span>
        <h2 className="mx-auto mt-4 max-w-[22ch] text-3xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {FAQS.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="text-lg font-bold tracking-tight">{faq.question}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
