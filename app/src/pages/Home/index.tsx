import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogIn, UserPlus } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="text-xl font-bold tracking-tight">STREAKS</div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center space-y-8 px-6 text-center">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-foreground">
            Build Better Habits
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your daily progress, maintain your streaks, and achieve your goals with our beautiful, minimalist habit tracker.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button size="lg" className="h-12 px-8" onClick={() => navigate("/register")}>
            <UserPlus className="mr-2 h-5 w-5" />
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8" onClick={() => navigate("/login")}>
            <LogIn className="mr-2 h-5 w-5" />
            Log In
          </Button>
        </div>
      </main>
    </div>
  );
}