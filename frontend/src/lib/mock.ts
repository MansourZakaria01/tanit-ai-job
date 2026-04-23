// Mock data layer used when VITE_MOCK_MODE !== "false".
// Replace with real API calls once backend is live.
export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills_required: string[];
  posted_at: string;
};

export const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Nebula Labs",
    location: "Remote · EU",
    description:
      "Build delightful interfaces in React + TypeScript. You'll own the design system and ship daily.",
    skills_required: ["React", "TypeScript", "Tailwind", "GraphQL", "Vite"],
    posted_at: "2d ago",
  },
  {
    id: "2",
    title: "Full-Stack Developer",
    company: "Kairos Tech",
    location: "Tunis · Hybrid",
    description:
      "Node.js + PostgreSQL + React. Help us scale our matching platform to 100k users.",
    skills_required: ["Node.js", "PostgreSQL", "React", "Docker", "AWS"],
    posted_at: "5d ago",
  },
  {
    id: "3",
    title: "ML Engineer — NLP",
    company: "Vector Forge",
    location: "Berlin · On-site",
    description:
      "Embeddings, semantic search, recommendation systems. Python heavy.",
    skills_required: ["Python", "PyTorch", "Embeddings", "FastAPI", "Postgres"],
    posted_at: "1w ago",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "Helix Cloud",
    location: "Remote · Global",
    description: "Kubernetes, Terraform, CI/CD pipelines at scale.",
    skills_required: ["Kubernetes", "Terraform", "AWS", "Docker", "Linux"],
    posted_at: "3d ago",
  },
];

export function mockMatch(jobSkills: string[], cvSkills: string[]) {
  const lowerCv = cvSkills.map((s) => s.toLowerCase());
  const matched = jobSkills.filter((s) => lowerCv.includes(s.toLowerCase()));
  const missing = jobSkills.filter((s) => !lowerCv.includes(s.toLowerCase()));
  const score = jobSkills.length === 0 ? 0 : Math.round((matched.length / jobSkills.length) * 100);
  return { score, matched_skills: matched, missing_skills: missing };
}
