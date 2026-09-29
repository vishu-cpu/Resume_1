import { z } from "zod";

const experience = z.object({
  company: z.string().max(120),
  role: z.string().max(120),
  location: z.string().max(120),
  start: z.string().max(40),
  end: z.string().max(40),
  description: z.string().max(1800)
});

const education = z.object({
  level: z.string().max(80),
  institution: z.string().max(160),
  field: z.string().max(120),
  start: z.string().max(40),
  end: z.string().max(40),
  grade: z.string().max(80)
});

export const resumeSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().max(120),
  location: z.string().max(120),
  age: z.string().max(10),
  phone: z.string().max(40),
  email: z.string().email().max(160),
  linkedin: z.string().max(250),
  github: z.string().max(250),
  website: z.string().max(250),
  summary: z.string().max(1800),
  skills: z.string().max(1500),
  experiences: z.array(experience).max(12),
  education: z.array(education).max(12),
  achievements: z.string().max(1800),
  certifications: z.string().max(1500),
  languages: z.string().max(800),
  hobbies: z.string().max(800),
  expectedSalary: z.string().max(100),
  noticePeriod: z.string().max(100)
});

export const submissionSchema = z.object({
  resume: resumeSchema,
  applicantEmail: z.string().email().max(160),
  paid: z.literal(true)
});
