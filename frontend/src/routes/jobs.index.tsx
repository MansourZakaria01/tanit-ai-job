import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SkillTag } from "@/components/SkillTag";
import { listJobs } from "@/services/jobs";
import type { Job } from "@/lib/mock";
import { useAuth } from "@/store/auth";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/jobs/")({
  component: Jobs,
  head: () => ({ meta: [{ title: "Browse jobs — TanitTalent" }] }),
});

function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const cvSkills = useAuth((s) => s.cvSkills);

  useEffect(() => {
    listJobs().then(setJobs);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold">Open roles</h1>
          <p className="text-muted-foreground mt-1">
            {cvSkills.length > 0
              ? "Sorted by potential match with your CV."
              : "Upload your CV to see match scores."}
          </p>
        </div>
        {cvSkills.length === 0 && (
          <Link
            to="/cv"
            className="hidden sm:inline-flex text-sm text-primary hover:underline"
          >
            Upload CV →
          </Link>
        )}
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} cvSkills={cvSkills} />
        ))}
      </div>
    </div>
  );
}

function JobCard({ job, cvSkills }: { job: Job; cvSkills: string[] }) {
  const lower = cvSkills.map((s) => s.toLowerCase());
  const matched = job.skills_required.filter((s) => lower.includes(s.toLowerCase()));
  const score = cvSkills.length
    ? Math.round((matched.length / job.skills_required.length) * 100)
    : null;

  return (
    <Link
      to="/jobs/$jobId"
      params={{ jobId: job.id }}
      className="block group"
    >
      <Card className="p-6 bg-gradient-card border-border/60 hover:border-primary/50 hover:shadow-glow transition-smooth">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
              <span>{job.company}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.posted_at}</span>
            </div>
            <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-smooth flex items-center gap-2">
              {job.title}
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-smooth" />
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills_required.map((s) => (
                <SkillTag
                  key={s}
                  label={s}
                  variant={cvSkills.length && matched.includes(s) ? "matched" : "default"}
                />
              ))}
            </div>
          </div>
          {score !== null && (
            <div className="md:text-right md:min-w-[100px]">
              <div className="text-xs text-muted-foreground">Match</div>
              <div
                className="font-display text-3xl font-bold"
                style={{
                  color:
                    score >= 75
                      ? "var(--success)"
                      : score >= 50
                      ? "var(--warning)"
                      : "var(--destructive)",
                }}
              >
                {score}%
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
