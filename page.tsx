"use client";

import { FileText, Sparkles, IndianRupee, MailCheck, ShieldCheck } from "lucide-react";
import { ResumeForm } from "@/components/ResumeForm";

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><div className="logo">R</div><span>{process.env.NEXT_PUBLIC_APP_NAME || "ResumeCraft"}</span></div>
        <span className="pill">Professional resume • ₹50</span>
      </header>

      <section className="hero">
        <div>
          <div className="pill" style={{display:"inline-flex", marginBottom:15}}>AI-assisted resume builder</div>
          <h1>Turn your details into a resume people can take seriously.</h1>
          <p>
            Fill in your profile, experience and education, improve your professional summary with AI,
            preview the result, then pay ₹50 by UPI to unlock the clean final PDF workflow.
          </p>
        </div>
        <div className="hero-card">
          <h3>Simple 6-step flow</h3>
          <p>Designed for a low-friction mobile + desktop experience.</p>
          <div className="hero-list">
            <div><FileText size={18}/> Enter personal, education and professional details</div>
            <div><Sparkles size={18}/> Enhance the summary with an AI assistant</div>
            <div><IndianRupee size={18}/> Pay ₹50 through your UPI QR</div>
            <div><MailCheck size={18}/> Submit your email and receive the clean PDF workflow</div>
            <div><ShieldCheck size={18}/> API keys stay server-side</div>
          </div>
        </div>
      </section>

      <ResumeForm />

      <footer className="footer">
        Built for deployment from GitHub. Customers pay ₹50 by UPI and submit; payment is checked manually by the owner.
      </footer>
    </main>
  );
}
