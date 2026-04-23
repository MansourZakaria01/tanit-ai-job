import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, FileText, Target, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "TanitTalent — AI-powered tech job matching" },
      {
        name: "description",
        content:
          "Smart CV-to-job matching for developers. Upload your CV, get scored against real tech roles in seconds.",
      },
    ],
  }),
});

function Landing() {
  return (
    <div className="bg-hero">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary mb-6">
            <Zap className="h-3 w-3" />
            AI-powered matching engine
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter">
            Where <span className="text-gradient">tech talent</span>
            <br />
            meets the right job.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your CV. We extract your skills, embed your profile, and score it against every
            open role — instantly.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-smooth">
              <Link to="/register">
                Find my match <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/jobs">Browse jobs</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> CV parsing</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Semantic match</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Skill gap analysis</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FileText className="h-5 w-5" />}
            title="Smart CV parsing"
            desc="Drop your PDF. We extract your skills, experience, and tech stack — no forms to fill."
          />
          <FeatureCard
            icon={<Brain className="h-5 w-5" />}
            title="AI semantic matching"
            desc="Beyond keywords. Embeddings compare meaning between your profile and each role."
          />
          <FeatureCard
            icon={<Target className="h-5 w-5" />}
            title="Skill gap insight"
            desc="See exactly what's matched, what's missing, and how to level up to land the role."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-card p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-hero opacity-60 pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Ready to find your <span className="text-gradient">next role</span>?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join as a developer to get matched, or as a recruiter to post roles.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Link to="/register">Create account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">I already have one</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="group p-6 bg-gradient-card border-border/60 hover:border-primary/50 transition-smooth hover:shadow-glow">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4 group-hover:shadow-glow transition-smooth">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}
