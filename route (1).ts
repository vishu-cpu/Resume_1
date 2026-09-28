import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import { submissionSchema } from "@/lib/validation";
import { ResumePdf } from "@/components/ResumePdf";
import React from "react";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "RESEND_API_KEY is not configured." }, { status: 500 });
    }

    const body = submissionSchema.parse(await req.json());
    const pdf = await renderToBuffer(React.createElement(ResumePdf, { data: body.resume }));

    const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || "indiaislove75@gmail.com";
    const from = process.env.RESEND_FROM_EMAIL || "ResumeCraft <onboarding@resend.dev>";
    const resend = new Resend(process.env.RESEND_API_KEY);

    const safeName = body.resume.name.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "") || "resume";
    const subject = `New Resume Order — ${body.resume.name} — ₹50 UPI`;

    const ownerResult = await resend.emails.send({
      from,
      to: [ownerEmail],
      replyTo: body.applicantEmail,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.55;color:#172033">
          <h2>New resume order received</h2>
          <p><strong>Applicant:</strong> ${escapeHtml(body.resume.name)}</p>
          <p><strong>Delivery email:</strong> ${escapeHtml(body.applicantEmail)}</p>
          <p><strong>Resume email:</strong> ${escapeHtml(body.resume.email)}</p>
          <p><strong>Amount expected:</strong> ₹50</p>
          <p><strong>Payment note:</strong> The user submitted the form after stating that the ₹50 payment was made. Please check your own UPI/bank payment notification manually.</p>
          <hr />
          <p>The clean PDF is attached to this email.</p>
        </div>
      `,
      attachments: [
        {
          filename: `${safeName}-resume.pdf`,
          content: pdf
        }
      ]
    });

    if (ownerResult.error) {
      console.error(ownerResult.error);
      return Response.json({ error: "Email delivery failed. Check your Resend configuration." }, { status: 502 });
    }

    const applicantResult = await resend.emails.send({
      from,
      to: [body.applicantEmail],
      replyTo: ownerEmail,
      subject: `Your ResumeCraft resume — ${body.resume.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.55;color:#172033">
          <h2>Your clean resume is ready</h2>
          <p>Hi ${escapeHtml(body.resume.name)},</p>
          <p>Thank you for using ResumeCraft. Your clean PDF resume is attached to this email.</p>
          <p>Regards,<br />ResumeCraft</p>
        </div>
      `,
      attachments: [
        {
          filename: `${safeName}-resume.pdf`,
          content: pdf
        }
      ]
    });

    if (applicantResult.error) {
      console.error(applicantResult.error);
      return Response.json({
        ok: true,
        warning: "Your request was received and the owner was notified, but the applicant delivery email could not be sent."
      });
    }

    return Response.json({
      ok: true,
      message: "Submitted successfully. Your clean resume has been sent to your email, and the resume service owner has been notified."
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Please check the form details and try again." }, { status: 400 });
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
