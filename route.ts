import OpenAI from "openai";
import { z } from "zod";

const inputSchema = z.object({
  summary: z.string().min(10).max(1800),
  role: z.string().max(120).optional(),
  skills: z.string().max(1500).optional(),
  experience: z.array(z.any()).max(12).optional()
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
    }

    const body = inputSchema.parse(await req.json());
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: [
        "You are an expert resume editor.",
        "Rewrite the user's professional summary to be concise, credible, ATS-friendly and achievement-oriented.",
        "Do not invent employers, titles, years, metrics, skills or qualifications.",
        "Use only information present in the input.",
        "Return only the final summary, without headings, quotes, bullets or commentary.",
        "Prefer 3-5 strong sentences."
      ].join(" "),
      input: JSON.stringify({
        summary: body.summary,
        role: body.role || "",
        skills: body.skills || "",
        experience: body.experience || []
      })
    });

    const summary = response.output_text.trim();
    if (!summary) return Response.json({ error: "The AI returned an empty summary." }, { status: 502 });
    return Response.json({ summary });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Could not enhance the summary. Please try again." }, { status: 500 });
  }
}
