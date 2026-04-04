import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Plus, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { habitService } from "@/services/habit.service";
import type { Habit } from "@/services/habit.service";
import Modal from "@/components/common/Modal";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await habitService.getAll();
        if (res.success) {
          setHabits(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch habits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCheckin = async (id: string) => {
    try {
      await habitService.checkin(id);
      // Refresh habits after check-in
      const res = await habitService.getAll();
      if (res.success) setHabits(res.data);
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  };

  const toggleHabitModal = () => {
    setShowModal((prev) => !prev);
  }
  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div
        className={`mx-auto max-w-4xl space-y-8 transition ${showModal ? "pointer-events-none select-none blur-sm" : ""}`}
      >
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="group">
            <LogOut className="mr-2 h-4 w-4 group-hover:text-destructive transition-colors" />
            Logout
          </Button>
        </header>

        <main className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Your Habits</CardTitle>
                <CardDescription>Track your daily progress.</CardDescription>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={toggleHabitModal}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2 py-4">
                  <div className="h-12 w-full bg-muted animate-pulse rounded-md" />
                  <div className="h-12 w-full bg-muted animate-pulse rounded-md" />
                </div>
              ) : habits.length > 0 ? (
                <div className="space-y-3 pb-4">
                  {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{habit.title}</p>
                        <p className="text-xs text-muted-foreground">{habit.frequency}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleCheckin(habit.id)}>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/20 border-border/60">
                  <p className="text-sm text-muted-foreground mb-4">You haven't created any habits yet.</p>
                  <Button variant="secondary" size="sm" onClick={toggleHabitModal}>
                    Create First Habit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Your all-time statistics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 transition-all hover:bg-muted/60">
                 <span className="font-medium text-sm">Longest Streak</span>
                 <span className="font-bold text-2xl font-mono">0</span>
               </div>
               <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 transition-all hover:bg-muted/60">
                 <span className="font-medium text-sm">Total Check-ins</span>
                 <span className="font-bold text-2xl font-mono">0</span>
               </div>
            </CardContent>
          </Card>
        </main>
      </div>
      {showModal && <Modal onClose={toggleHabitModal} />}
    </div>
  );
};
