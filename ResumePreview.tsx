"use client";

import type { ResumeData } from "@/lib/types";

function splitLines(value: string) {
  return value.split(/\n|•|;/).map(s => s.trim()).filter(Boolean);
}

export function ResumePreview({
  data,
  watermark = true
}: {
  data: ResumeData;
  watermark?: boolean;
}) {
  const skills = splitLines(data.skills);

  return (
    <div className="preview-wrap">
      <div className="preview-note">
        <span>Live preview</span>
        <span>{watermark ? "Watermarked until payment" : "Final version"}</span>
      </div>
      <div className="resume-paper">
        <h1>{data.name || "Your Name"}</h1>
        <div className="role">{data.role || "Professional Title"}</div>
        <div className="contact">
          {data.location && <span>{data.location}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
          {data.linkedin && <span>LinkedIn</span>}
          {data.github && <span>GitHub</span>}
          {data.website && <span>Portfolio</span>}
        </div>

        <section className="rsec">
          <h4>Professional Summary</h4>
          <div className={data.summary ? "rtext" : "empty"}>
            {data.summary || "Your AI-enhanced professional summary will appear here."}
          </div>
        </section>

        {skills.length > 0 && (
          <section className="rsec">
            <h4>Skills</h4>
            <div className="rtext">{skills.join("  •  ")}</div>
          </section>
        )}

        {data.experiences.some(x => x.company || x.role || x.description) && (
          <section className="rsec">
            <h4>Experience</h4>
            {data.experiences.filter(x => x.company || x.role || x.description).map((x, i) => (
              <div className="ritem" key={i}>
                <div className="rhead">
                  <span>{x.role || "Role"}{x.company ? ` — ${x.company}` : ""}</span>
                  <span>{[x.start, x.end].filter(Boolean).join(" – ")}</span>
                </div>
                {x.location && <div className="rsub">{x.location}</div>}
                {x.description && (
                  <ul className="rbullets">
                    {splitLines(x.description).slice(0, 4).map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {data.education.some(x => x.institution || x.field || x.grade) && (
          <section className="rsec">
            <h4>Education</h4>
            {data.education.filter(x => x.institution || x.field || x.grade).map((x, i) => (
              <div className="ritem" key={i}>
                <div className="rhead">
                  <span>{x.level}{x.field ? ` — ${x.field}` : ""}</span>
                  <span>{[x.start, x.end].filter(Boolean).join(" – ")}</span>
                </div>
                <div className="rsub">{x.institution}{x.grade ? ` · ${x.grade}` : ""}</div>
              </div>
            ))}
          </section>
        )}

        {data.achievements && (
          <section className="rsec"><h4>Achievements</h4><div className="rtext">{data.achievements}</div></section>
        )}
        {data.certifications && (
          <section className="rsec"><h4>Certifications</h4><div className="rtext">{data.certifications}</div></section>
        )}
        {data.languages && (
          <section className="rsec"><h4>Languages</h4><div className="rtext">{data.languages}</div></section>
        )}
        {(data.hobbies || data.expectedSalary || data.noticePeriod) && (
          <section className="rsec">
            <h4>Additional Details</h4>
            <div className="rtext">
              {data.hobbies && `Hobbies: ${data.hobbies}\n`}
              {data.expectedSalary && `Expected salary: ${data.expectedSalary}\n`}
              {data.noticePeriod && `Notice period: ${data.noticePeriod}`}
            </div>
          </section>
        )}
      </div>
      {watermark && <div className="watermark"><span>PREVIEW</span></div>}
    </div>
  );
}
