import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/store/auth";
import { registerRequest } from "@/services/auth";
import { toast } from "sonner";
import { Briefcase, User } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: Register,
  head: () => ({ meta: [{ title: "Sign up — TanitTalent" }] }),
});

function Register() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, token } = await registerRequest(name, email, password, role);
      login(user, token);
      toast.success("Account created");
      navigate({ to: role === "recruiter" ? "/recruiter" : "/jobs" });
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="p-8 bg-gradient-card border-border/60 shadow-elegant">
        <h1 className="font-display text-3xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose how you'll use TanitTalent.</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <RoleCard
            active={role === "employee"}
            onClick={() => setRole("employee")}
            icon={<User className="h-4 w-4" />}
            label="Developer"
            sub="Find jobs"
          />
          <RoleCard
            active={role === "recruiter"}
            onClick={() => setRole("recruiter")}
            icon={<Briefcase className="h-4 w-4" />}
            label="Recruiter"
            sub="Post jobs"
          />
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
            {loading ? "Creating..." : "Create account"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Already have one?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition-smooth ${
        active
          ? "border-primary bg-primary/10 shadow-glow"
          : "border-border bg-secondary/40 hover:border-primary/50"
      }`}
    >
      <div className={`mb-2 ${active ? "text-primary" : "text-muted-foreground"}`}>{icon}</div>
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </button>
  );
}
