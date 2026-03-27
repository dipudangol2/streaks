import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="group">
            <LogOut className="mr-2 h-4 w-4 group-hover:text-destructive transition-colors" />
            Logout
          </Button>
        </header>

        <main className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Habits</CardTitle>
              <CardDescription>Track your daily progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-4">You haven't created any habits yet.</p>
                <Button variant="secondary">Create Habit</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Your all-time statistics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 transition-all hover:bg-muted/60">
                 <span className="font-medium text-sm">Longest Streak</span>
                 <span className="font-bold text-2xl font-mono">0</span>
               </div>
               <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 transition-all hover:bg-muted/60">
                 <span className="font-medium text-sm">Total Check-ins</span>
                 <span className="font-bold text-2xl font-mono">0</span>
               </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
