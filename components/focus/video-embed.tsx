interface VideoEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export function VideoEmbed({ videoId, title, className }: VideoEmbedProps) {
  return (
    <div className={className}>
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{title}</p>
    </div>
  );
}
