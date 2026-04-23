import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillTag } from "@/components/SkillTag";
import { createJob, listJobs } from "@/services/jobs";
import type { Job } from "@/lib/mock";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruiter")({
  component: Recruiter,
  head: () => ({ meta: [{ title: "Recruiter dashboard — TanitTalent" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("tanittalent-auth");
      if (!raw) throw redirect({ to: "/login" });
    }
  },
});

function Recruiter() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);

  const refresh = () => listJobs().then(setJobs);
  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold">Recruiter dashboard</h1>
          <p className="text-muted-foreground mt-1">Post roles and review applicants.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="bg-gradient-primary text-primary-foreground shadow-glow">
          {showForm ? <><X className="h-4 w-4 mr-1" /> Cancel</> : <><Plus className="h-4 w-4 mr-1" /> New job</>}
        </Button>
      </div>

      {showForm && (
        <NewJobForm
          onCreated={() => {
            refresh();
            setShowForm(false);
          }}
        />
      )}

      <div className="grid gap-3 mt-6">
        {jobs.map((j) => (
          <Card key={j.id} className="p-5 bg-gradient-card border-border/60">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-mono text-muted-foreground">{j.company} · {j.location}</div>
                <h3 className="font-display text-lg font-semibold mt-1">{j.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {j.skills_required.map((s) => (
                    <SkillTag key={s} label={s} />
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">{j.posted_at}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NewJobForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skillsRaw, setSkillsRaw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob({
        title,
        company,
        location,
        description,
        skills_required: skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
      });
      toast.success("Job posted");
      onCreated();
    } catch {
      toast.error("Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/30 shadow-glow">
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Job title</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior React Engineer" />
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Location</Label>
          <Input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote · EU" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Required skills (comma-separated)</Label>
          <Input required value={skillsRaw} onChange={(e) => setSkillsRaw(e.target.value)} placeholder="React, TypeScript, Node.js" />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading} className="bg-gradient-primary text-primary-foreground shadow-glow">
            {loading ? "Posting..." : "Post job"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
