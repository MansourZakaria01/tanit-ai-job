import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const navItem = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm transition-smooth hover:text-primary ${
        path === to ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-gradient">TanitTalent</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItem("/jobs", "Jobs")}
          {user?.role === "employee" && navItem("/cv", "My CV")}
          {user?.role === "recruiter" && navItem("/recruiter", "Recruiter")}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                {user.email} · <span className="text-primary">{user.role}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/login" })}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate({ to: "/register" })}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
