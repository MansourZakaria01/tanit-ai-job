import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkillTag } from "@/components/SkillTag";
import { MatchScore } from "@/components/MatchScore";
import { getJob, matchJob } from "@/services/jobs";
import type { Job } from "@/lib/mock";
import { useAuth } from "@/store/auth";
import { ArrowLeft, MapPin, Clock, Building2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs/$jobId")({
  component: JobDetail,
  loader: async ({ params }) => {
    const job = await getJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.job
          ? `${loaderData.job.title} at ${loaderData.job.company} — TanitTalent`
          : "Job — TanitTalent",
      },
    ],
  }),
});

function JobDetail() {
  const { job } = Route.useLoaderData() as { job: Job };
  const { cvSkills, cvFileName, user } = useAuth();
  const [match, setMatch] = useState<{ score: number; matched_skills: string[]; missing_skills: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cvSkills.length > 0) {
      matchJob(job.id, cvSkills).then(setMatch);
    } else {
      setMatch(null);
    }
  }, [job.id, cvSkills]);

  const apply = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success("Application sent!", { description: "The recruiter will be in touch." });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-smooth">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 bg-gradient-card border-border/60">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
              <Building2 className="h-3 w-3" /> {job.company}
              <span>·</span>
              <MapPin className="h-3 w-3" /> {job.location}
              <span>·</span>
              <Clock className="h-3 w-3" /> {job.posted_at}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{job.title}</h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">{job.description}</p>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Required skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills_required.map((s) => (
                  <SkillTag
                    key={s}
                    label={s}
                    variant={
                      match
                        ? match.matched_skills.includes(s)
                          ? "matched"
                          : "missing"
                        : "default"
                    }
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-gradient-card border-primary/30 shadow-glow">
            {match ? (
              <>
                <MatchScore score={match.score} />
                <div className="mt-6 space-y-4">
                  {match.matched_skills.length > 0 && (
                    <div>
                      <div className="text-xs text-success font-mono mb-2">✓ MATCHED</div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matched_skills.map((s) => (
                          <SkillTag key={s} label={s} variant="matched" />
                        ))}
                      </div>
                    </div>
                  )}
                  {match.missing_skills.length > 0 && (
                    <div>
                      <div className="text-xs text-destructive font-mono mb-2">✗ MISSING</div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.missing_skills.map((s) => (
                          <SkillTag key={s} label={s} variant="missing" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-4 font-mono">
                  Based on: {cvFileName}
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <h3 className="font-display text-lg font-semibold">No CV yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload one to see your match score.
                </p>
                <Button asChild className="mt-4 w-full bg-gradient-primary text-primary-foreground">
                  <Link to={user ? "/cv" : "/register"}>
                    {user ? "Upload CV" : "Sign up"}
                  </Link>
                </Button>
              </div>
            )}
          </Card>

          {user?.role === "employee" && (
            <Button onClick={apply} disabled={loading} size="lg" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
              {loading ? "Sending..." : "Apply now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
