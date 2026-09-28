"use client";

import { useMemo, useState } from "react";
import { Sparkles, Plus, Trash2, ArrowLeft, ArrowRight, Check, CreditCard, Mail, ShieldCheck } from "lucide-react";
import type { Education, Experience, ResumeData } from "@/lib/types";
import { emptyResume } from "@/lib/types";
import { ResumePreview } from "@/components/ResumePreview";

const steps = ["Personal", "Summary & Skills", "Experience", "Education", "Extras", "Payment"];

export function ResumeForm() {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [step, setStep] = useState(0);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [paid, setPaid] = useState(false);
  const [deliveryEmail, setDeliveryEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData(prev => ({ ...prev, [key]: value }));

  const updateExperience = (index: number, patch: Partial<Experience>) =>
    setData(prev => ({ ...prev, experiences: prev.experiences.map((x, i) => i === index ? { ...x, ...patch } : x) }));

  const updateEducation = (index: number, patch: Partial<Education>) =>
    setData(prev => ({ ...prev, education: prev.education.map((x, i) => i === index ? { ...x, ...patch } : x) }));

  const addExperience = () => setData(prev => ({
    ...prev,
    experiences: [...prev.experiences, { company: "", role: "", location: "", start: "", end: "", description: "" }]
  }));
  const removeExperience = (index: number) => setData(prev => ({
    ...prev, experiences: prev.experiences.filter((_, i) => i !== index)
  }));
  const addEducation = () => setData(prev => ({
    ...prev,
    education: [...prev.education, { level: "Other", institution: "", field: "", start: "", end: "", grade: "" }]
  }));
  const removeEducation = (index: number) => setData(prev => ({
    ...prev, education: prev.education.filter((_, i) => i !== index)
  }));

  const enhanceSummary = async () => {
    if (!data.summary.trim()) {
      setAiMessage("Enter a rough summary first, then let AI improve it.");
      return;
    }
    setAiBusy(true); setAiMessage(""); setError("");
    try {
      const res = await fetch("/api/enhance-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: data.summary,
          role: data.role,
          skills: data.skills,
          experience: data.experiences
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "AI request failed");
      update("summary", body.summary);
      setAiMessage("AI improved your summary. Review it before using it.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not enhance summary.");
    } finally {
      setAiBusy(false);
    }
  };

  const canNext = useMemo(() => {
    if (step === 0) return data.name.trim().length >= 2 && data.email.trim().length > 0;
    if (step === 5) return paid && deliveryEmail.includes("@");
    return true;
  }, [step, data, paid, deliveryEmail]);

  const submit = async () => {
    setSubmitting(true); setError(""); setResult("");
    try {
      const res = await fetch("/api/submit-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: data, applicantEmail: deliveryEmail, paid: true })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Submission failed");
      setResult(body.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="builder">
      <div className="panel form-panel">
        <div className="stepper">
          {steps.map((label, i) => (
            <button key={label} className={`step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`} onClick={() => setStep(i)}>
              {i < step ? <Check size={13} /> : null} {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <>
            <div className="section-title"><div><h2>Personal & contact details</h2><p>Keep contact information concise and professional.</p></div></div>
            <div className="grid">
              <Field label="Full name *"><input value={data.name} onChange={e => update("name", e.target.value)} placeholder="Vishal Kumar" /></Field>
              <Field label="Professional title"><input value={data.role} onChange={e => update("role", e.target.value)} placeholder="Software Developer" /></Field>
              <Field label="Location"><input value={data.location} onChange={e => update("location", e.target.value)} placeholder="Delhi, India" /></Field>
              <Field label="Age"><input value={data.age} onChange={e => update("age", e.target.value)} placeholder="24" /></Field>
              <Field label="Phone"><input value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98XXXXXXXX" /></Field>
              <Field label="Email *"><input type="email" value={data.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" /></Field>
              <Field label="LinkedIn"><input value={data.linkedin} onChange={e => update("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" /></Field>
              <Field label="GitHub"><input value={data.github} onChange={e => update("github", e.target.value)} placeholder="github.com/yourname" /></Field>
              <Field label="Portfolio / website"><input value={data.website} onChange={e => update("website", e.target.value)} placeholder="yourportfolio.com" /></Field>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="section-title"><div><h2>Professional summary & skills</h2><p>Write naturally; the AI assistant can polish your summary.</p></div></div>
            <div className="ai-box">
              <div className="ai-head"><div><strong><Sparkles size={15} style={{verticalAlign:"-3px"}} /> AI Summary Assistant</strong><span>Server-side API key · never exposed to the browser</span></div></div>
              <div className="field">
                <label>Professional summary</label>
                <textarea value={data.summary} onChange={e => update("summary", e.target.value)} placeholder="Example: I am a results-driven developer with 2 years of experience building web applications..." />
              </div>
              <div className="ai-actions">
                <button className="btn primary" onClick={enhanceSummary} disabled={aiBusy}>
                  <Sparkles size={15} /> {aiBusy ? "Enhancing..." : "Enhance with AI"}
                </button>
                <span className="hint">AI rewrites for clarity, impact and ATS-friendly language without inventing experience.</span>
              </div>
              {aiMessage && <div className="success-box" style={{marginTop:12}}>{aiMessage}</div>}
            </div>
            <div className="grid">
              <Field label="Skills" full><textarea value={data.skills} onChange={e => update("skills", e.target.value)} placeholder="JavaScript; React; Node.js; SQL; Git; Communication" /><span className="hint">Separate skills with commas, semicolons, or new lines.</span></Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="section-title">
              <div><h2>Experience</h2><p>Add jobs, internships, freelance work or apprenticeships.</p></div>
              <button className="btn secondary" onClick={addExperience}><Plus size={15}/> Add experience</button>
            </div>
            {data.experiences.map((x, i) => (
              <div className="repeat-card" key={i}>
                <div className="repeat-head"><strong>Experience {i + 1}</strong><button className="link-btn" onClick={() => removeExperience(i)}><Trash2 size={14}/> Remove</button></div>
                <div className="grid">
                  <Field label="Company"><input value={x.company} onChange={e => updateExperience(i, {company:e.target.value})} /></Field>
                  <Field label="Role"><input value={x.role} onChange={e => updateExperience(i, {role:e.target.value})} /></Field>
                  <Field label="Location"><input value={x.location} onChange={e => updateExperience(i, {location:e.target.value})} /></Field>
                  <Field label="Start"><input value={x.start} onChange={e => updateExperience(i, {start:e.target.value})} placeholder="Jun 2023" /></Field>
                  <Field label="End"><input value={x.end} onChange={e => updateExperience(i, {end:e.target.value})} placeholder="Present" /></Field>
                  <Field label="Achievements / responsibilities" full><textarea value={x.description} onChange={e => updateExperience(i, {description:e.target.value})} placeholder="Built..., improved..., reduced..., led..." /><span className="hint">Use one achievement per line. Quantify results when possible.</span></Field>
                </div>
              </div>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <div className="section-title">
              <div><h2>Education</h2><p>Include 10th, 12th, graduation, post-graduation, Diploma, ITI and other qualifications.</p></div>
              <button className="btn secondary" onClick={addEducation}><Plus size={15}/> Add qualification</button>
            </div>
            {data.education.map((x, i) => (
              <div className="repeat-card" key={i}>
                <div className="repeat-head"><strong>Qualification {i + 1}</strong><button className="link-btn" onClick={() => removeEducation(i)}><Trash2 size={14}/> Remove</button></div>
                <div className="grid">
                  <Field label="Level"><select value={x.level} onChange={e => updateEducation(i, {level:e.target.value})}>
                    {["10th","12th","Diploma","ITI","Graduation","Post Graduation","Other"].map(v => <option key={v}>{v}</option>)}
                  </select></Field>
                  <Field label="Institution"><input value={x.institution} onChange={e => updateEducation(i, {institution:e.target.value})} /></Field>
                  <Field label="Field / course"><input value={x.field} onChange={e => updateEducation(i, {field:e.target.value})} /></Field>
                  <Field label="Start"><input value={x.start} onChange={e => updateEducation(i, {start:e.target.value})} /></Field>
                  <Field label="End"><input value={x.end} onChange={e => updateEducation(i, {end:e.target.value})} /></Field>
                  <Field label="Grade / percentage / CGPA"><input value={x.grade} onChange={e => updateEducation(i, {grade:e.target.value})} /></Field>
                </div>
              </div>
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <div className="section-title"><div><h2>Additional professional details</h2><p>Add only information that strengthens the application.</p></div></div>
            <div className="grid">
              <Field label="Achievements" full><textarea value={data.achievements} onChange={e => update("achievements", e.target.value)} placeholder="Awards, competition results, measurable achievements..." /></Field>
              <Field label="Certifications" full><textarea value={data.certifications} onChange={e => update("certifications", e.target.value)} placeholder="Certification — Issuer — Year" /></Field>
              <Field label="Languages"><input value={data.languages} onChange={e => update("languages", e.target.value)} placeholder="English, Hindi" /></Field>
              <Field label="Hobbies"><input value={data.hobbies} onChange={e => update("hobbies", e.target.value)} placeholder="Reading, cricket, photography" /></Field>
              <Field label="Expected salary"><input value={data.expectedSalary} onChange={e => update("expectedSalary", e.target.value)} placeholder="₹6–8 LPA" /></Field>
              <Field label="Notice period"><input value={data.noticePeriod} onChange={e => update("noticePeriod", e.target.value)} placeholder="30 days" /></Field>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="section-title"><div><h2>Pay ₹50 & receive the clean resume</h2><p>Scan the UPI QR, pay ₹50, then enter the email where you want the clean resume delivered.</p></div></div>
            <div className="pay-box">
              <div className="pay-layout">
                <img src="/qr-payment.png" className="qr" alt="UPI payment QR code" />
                <div>
                  <div className="price">₹50</div>
                  <div className="upi">UPI: {process.env.NEXT_PUBLIC_UPI_ID || "vishal6705@kotak"}</div>
                  <p className="hint">Pay to {process.env.NEXT_PUBLIC_UPI_NAME || "VISHAL"}. Use any UPI app.</p>
                  <label className="btn secondary" style={{marginTop:10}}>
                    <input type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)} style={{marginRight:8}} />
                    I have paid ₹50
                  </label>
                </div>
              </div>
              <div className="notice" style={{marginTop:18}}>
                Pay ₹50 using the QR, tick “I have paid ₹50”, enter your email and submit. Payment is checked manually by the resume service owner.
              </div>
              <div className="grid" style={{marginTop:18}}>
                <Field label="Email where you want the resume delivered *"><input type="email" value={deliveryEmail} onChange={e => setDeliveryEmail(e.target.value)} placeholder="candidate@example.com" /></Field>
              </div>
              <div className="hint" style={{display:"flex",gap:7,alignItems:"center"}}><ShieldCheck size={14}/> Your resume and delivery email are sent securely to the server. The owner will manually check the ₹50 payment notification.</div>
            </div>

            <div className="row-actions">
              <div />
              <button className="btn success" onClick={submit} disabled={!canNext || submitting}>
                <Mail size={15}/> {submitting ? "Sending..." : "Submit & send resume"}
              </button>
            </div>
            {result && <div className="success-box" style={{marginTop:14}}>{result}</div>}
            {error && <div className="error-box" style={{marginTop:14}}>{error}</div>}
          </>
        )}

        {error && step !== 5 && <div className="error-box" style={{marginTop:14}}>{error}</div>}

        {step < 5 && (
          <div className="row-actions">
            <button className="btn ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}><ArrowLeft size={15}/> Back</button>
            <button className="btn primary" onClick={() => setStep(Math.min(5, step + 1))} disabled={!canNext}>Next <ArrowRight size={15}/></button>
          </div>
        )}
      </div>

      <div className="panel preview-panel">
        <ResumePreview data={data} watermark={!paid} />
        {!paid && (
          <div className="notice" style={{margin:"8px 5px 0"}}>
            <CreditCard size={14} style={{verticalAlign:"-3px"}}/> The preview is watermarked. The clean final PDF is prepared after the ₹50 payment step is submitted.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={`field ${full ? "full" : ""}`}><label>{label}</label>{children}</div>;
}
