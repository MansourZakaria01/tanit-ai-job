import { api, MOCK_MODE } from "@/lib/api";
import { MOCK_JOBS, mockMatch, type Job } from "@/lib/mock";

let createdJobs: Job[] = [];

export async function listJobs(): Promise<Job[]> {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 200));
    return [...createdJobs, ...MOCK_JOBS];
  }
  const { data } = await api.get("/api/jobs");
  return data;
}

export async function getJob(id: string): Promise<Job | undefined> {
  if (MOCK_MODE) {
    return [...createdJobs, ...MOCK_JOBS].find((j) => j.id === id);
  }
  const { data } = await api.get(`/api/jobs/${id}`);
  return data;
}

export async function createJob(input: Omit<Job, "id" | "posted_at">): Promise<Job> {
  if (MOCK_MODE) {
    const job: Job = {
      ...input,
      id: "new_" + Date.now(),
      posted_at: "just now",
    };
    createdJobs = [job, ...createdJobs];
    return job;
  }
  const { data } = await api.post("/api/jobs", input);
  return data;
}

export async function matchJob(jobId: string, cvSkills: string[]) {
  if (MOCK_MODE) {
    const job = [...createdJobs, ...MOCK_JOBS].find((j) => j.id === jobId);
    return mockMatch(job?.skills_required ?? [], cvSkills);
  }
  const { data } = await api.post("/api/match", { jobId, cvSkills });
  return data as { score: number; matched_skills: string[]; missing_skills: string[] };
}

export async function uploadCv(file: File): Promise<{ skills: string[]; fileName: string }> {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 600));
    // Pretend we extracted some common skills
    const pool = ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind", "Docker", "Python"];
    const skills = pool.slice(0, 4 + Math.floor(Math.random() * 3));
    return { skills, fileName: file.name };
  }
  const fd = new FormData();
  fd.append("cv", file);
  const { data } = await api.post("/api/cv/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
