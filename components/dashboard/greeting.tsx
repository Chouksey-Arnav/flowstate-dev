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
    <h1 className="text-2xl font-semibold text-foreground">
      {greeting}{name ? `, ${name}` : ""}
    </h1>
  );
}
