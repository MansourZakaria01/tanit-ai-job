import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkillTag } from "@/components/SkillTag";
import { uploadCv } from "@/services/jobs";
import { useAuth } from "@/store/auth";
import { Upload, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cv")({
  component: CvPage,
  head: () => ({ meta: [{ title: "My CV — TanitTalent" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("tanittalent-auth");
      if (!raw) throw redirect({ to: "/login" });
    }
  },
});

function CvPage() {
  const { cvFileName, cvSkills, setCv } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Please upload a PDF");
      return;
    }
    setLoading(true);
    try {
      const { fileName, skills } = await uploadCv(file);
      setCv(fileName, skills);
      toast.success("CV processed", { description: `${skills.length} skills extracted` });
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-display text-4xl font-bold">My CV</h1>
      <p className="text-muted-foreground mt-1">
        Upload a PDF. We'll extract your skills and use them to match jobs.
      </p>

      <Card className="mt-8 p-8 bg-gradient-card border-border/60">
        {cvFileName ? (
          <div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/60 border border-border">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">{cvFileName}</div>
                  <div className="text-xs text-muted-foreground">{cvSkills.length} skills extracted</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCv("", [])}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Extracted skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {cvSkills.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <label className="block">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                />
                <Button asChild variant="outline">
                  <span>Replace CV</span>
                </Button>
              </label>
            </div>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-smooth">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">
                {loading ? "Processing..." : "Drop your CV here"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                PDF only · We extract skills automatically
              </p>
            </div>
          </label>
        )}
      </Card>
    </div>
  );
}
