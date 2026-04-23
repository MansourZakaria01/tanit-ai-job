import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { loginRequest } from "@/services/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Login — TanitTalent" }] }),
});

function Login() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, token } = await loginRequest(email, password);
      login(user, token);
      toast.success(`Welcome back, ${user.name}`);
      navigate({ to: user.role === "recruiter" ? "/recruiter" : "/jobs" });
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="p-8 bg-gradient-card border-border/60 shadow-elegant">
        <h1 className="font-display text-3xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Log in to your TanitTalent account.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-[10px] text-center text-muted-foreground/70 font-mono">
            Tip: use any email — try "recruiter@x.com" for recruiter mode (mock).
          </p>
        </form>
      </Card>
    </div>
  );
}
