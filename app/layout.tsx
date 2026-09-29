import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeCraft — Professional Resume Builder",
  description: "Create a professional resume with AI-enhanced summaries and get the clean PDF for ₹50."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
