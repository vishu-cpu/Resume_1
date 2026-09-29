export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  description: string;
};

export type Education = {
  level: string;
  institution: string;
  field: string;
  start: string;
  end: string;
  grade: string;
};

export type ResumeData = {
  name: string;
  role: string;
  location: string;
  age: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  skills: string;
  experiences: Experience[];
  education: Education[];
  achievements: string;
  certifications: string;
  languages: string;
  hobbies: string;
  expectedSalary: string;
  noticePeriod: string;
};

export const emptyResume: ResumeData = {
  name: "",
  role: "",
  location: "",
  age: "",
  phone: "",
  email: "",
  linkedin: "",
  github: "",
  website: "",
  summary: "",
  skills: "",
  experiences: [{ company: "", role: "", location: "", start: "", end: "", description: "" }],
  education: [
    { level: "Graduation", institution: "", field: "", start: "", end: "", grade: "" },
    { level: "12th", institution: "", field: "", start: "", end: "", grade: "" },
    { level: "10th", institution: "", field: "", start: "", end: "", grade: "" }
  ],
  achievements: "",
  certifications: "",
  languages: "",
  hobbies: "",
  expectedSalary: "",
  noticePeriod: ""
};
