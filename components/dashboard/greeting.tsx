function getGreeting(hour: number): string {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

interface GreetingProps {
  name: string;
}

export function Greeting({ name }: GreetingProps) {
  const greeting = getGreeting(new Date().getHours());
  return (
    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      {greeting}<span className="text-gradient">{name ? `, ${name}` : ""}</span>
    </h1>
  );
}
