import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VideoEmbed } from "./video-embed";

const MOTIVATION_VIDEOS = [
  {
    id: "UwMS0J2eTXE",
    title: "Give me 58 seconds, I'll delete your fear of rejection — Dan Martell",
  },
  {
    id: "r6zFZQm0hcc",
    title: "Give me 54 seconds, I'll make you dangerously motivated — Dan Martell",
  },
  {
    id: "5fHR_De7FIU",
    title: "Give me 51 seconds, unlock your full potential — Dan Martell",
  },
];

export function MotivationVideos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Need a push?</CardTitle>
        <CardDescription>
          Three 60-second hits from Dan Martell. Watch one before you start — kill the excuse, then get to work.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MOTIVATION_VIDEOS.map((v) => (
            <VideoEmbed key={v.id} videoId={v.id} title={v.title} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
