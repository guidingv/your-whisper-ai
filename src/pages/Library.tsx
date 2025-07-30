import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Heart, BarChart3, Clock, Shuffle, 
  MoreHorizontal, Download, RefreshCw 
} from "lucide-react";

const Library = () => {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  // Mock data
  const favorites = [
    {
      id: "1",
      title: "Gentle Tapping for Sleep",
      duration: "15:30",
      mood: "tired",
      triggers: ["tapping", "whispering"],
      plays: 12,
      createdAt: "2024-01-28"
    },
    {
      id: "2", 
      title: "Brushing Away Stress",
      duration: "20:45",
      mood: "stressed",
      triggers: ["brushing", "soft speaking"],
      plays: 8,
      createdAt: "2024-01-27"
    },
    {
      id: "3",
      title: "Personal Attention & Affirmations",
      duration: "12:15",
      mood: "lonely",
      triggers: ["personal attention", "affirmations"],
      plays: 15,
      createdAt: "2024-01-26"
    }
  ];

  const moodStats = [
    { mood: "tired", count: 8, icon: "😴" },
    { mood: "stressed", count: 5, icon: "😰" },
    { mood: "calm", count: 3, icon: "😌" },
    { mood: "lonely", count: 2, icon: "🥺" }
  ];

  const recentActivity = [
    { date: "Today", tracks: ["Gentle Tapping", "Rain Sounds"] },
    { date: "Yesterday", tracks: ["Brushing Session", "Whispered Stories"] },
    { date: "Jan 26", tracks: ["Personal Attention"] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-whisper-start to-whisper-end p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            My Whisper Archive
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personal collection of comfort
          </p>
        </div>

        <Tabs defaultValue="favorites" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Saved Tracks</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle Play
                </Button>
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Play All
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {favorites.map((track) => (
                <Card 
                  key={track.id} 
                  className={`glass-card cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedTrack === track.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTrack(track.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="rounded-full w-12 h-12"
                        >
                          <Play className="w-5 h-5" />
                        </Button>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{track.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {track.duration}
                            </span>
                            <span>{track.plays} plays</span>
                            <Badge variant="secondary" className="capitalize">
                              {track.mood}
                            </Badge>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {track.triggers.map((trigger) => (
                              <Badge key={trigger} variant="outline" className="text-xs">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Heart className="w-4 h-4 fill-current text-red-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentActivity.map((day, index) => (
                <Card key={index} className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{day.date}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {day.tracks.map((track, trackIndex) => (
                        <div 
                          key={trackIndex}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/20"
                        >
                          <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Play className="w-3 h-3" />
                            </Button>
                            <span>{track}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Remix
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Playlists Tab */}
          <TabsContent value="playlists" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Sleep Playlists</h2>
              <Button>Create New Playlist</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Bedtime Routine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your perfect wind-down sequence
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>• Gentle breathing (5 min)</div>
                    <div>• Soft tapping (10 min)</div>
                    <div>• Sleep whispers (30 min)</div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Play Sequence
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Stress Relief</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quick calm-down sessions
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>• Affirmations (3 min)</div>
                    <div>• Brushing sounds (7 min)</div>
                    <div>• Personal attention (15 min)</div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Start Relief
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Comfort Patterns</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Mood Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moodStats.map((stat) => (
                      <div key={stat.mood} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{stat.icon}</span>
                          <span className="capitalize">{stat.mood}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-background/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(stat.count / 18) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {stat.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total listening time</span>
                    <span className="font-semibold">4h 32m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sessions completed</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest session</span>
                    <span className="font-semibold">45 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most used trigger</span>
                    <Badge variant="secondary">Whispering</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;