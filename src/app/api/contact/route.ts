import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
// header-safe: no line breaks in anything that ends up in a subject or name
const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ");
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Leads are emailed through Gmail's SMTP server with an App Password
 * (Google Account → Security → 2-Step Verification → App passwords).
 * Set in .env.local (and in the host's environment settings when deployed):
 *   GMAIL_USER          the Gmail address that sends, e.g. studiofabble@gmail.com
 *   GMAIL_APP_PASSWORD  the 16-character app password
 *   CONTACT_TO          optional; where leads go (defaults to GMAIL_USER)
 */
const gmail =
  process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, "") },
      })
    : null;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "The form data couldn't be read." }, { status: 400 });
  }

  // bots fill the hidden field; pretend it worked
  if (str(body.company_site, 200)) return NextResponse.json({ ok: true });

  const lead = {
    name: oneLine(str(body.name, 120)),
    email: str(body.email, 200),
    need: oneLine(str(body.need, 20)),
    budget: oneLine(str(body.budget, 40)),
    currency: str(body.currency, 3) === "INR" ? "INR" : "USD",
    message: str(body.message, 5000),
  };

  if (!lead.name) return NextResponse.json({ error: "Add your name." }, { status: 422 });
  if (!isEmail(lead.email)) return NextResponse.json({ error: "That email address doesn't look right." }, { status: 422 });
  if (lead.message.length < 10) return NextResponse.json({ error: "Add a few words about the project." }, { status: 422 });

  if (!gmail) {
    // never drop a lead silently on the live site: tell the visitor to use another channel
    console.warn("[contact] Gmail isn't configured (GMAIL_USER / GMAIL_APP_PASSWORD). Lead:", lead);
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: `The form is offline right now. Please email ${site.email} or message us on WhatsApp.` },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Looking for", lead.need || "Not specified"],
    ["Budget", lead.budget ? `${lead.budget} (${lead.currency})` : "Not specified"],
  ];

  try {
    await gmail.sendMail({
      from: { name: "Fabble website", address: process.env.GMAIL_USER! },
      to: process.env.CONTACT_TO || process.env.GMAIL_USER,
      // hitting Reply answers the client, not yourself
      replyTo: { name: lead.name, address: lead.email },
      subject: `New ${lead.need ? lead.need.toLowerCase() + " " : ""}enquiry from ${lead.name}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${lead.message}\n\nReply to this email to answer ${lead.name} directly.`,
      html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.55;color:#111">
  <h2 style="margin:0 0 16px;font-size:20px">New enquiry from ${esc(lead.name)}</h2>
  <table style="border-collapse:collapse;margin-bottom:16px">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
  <div style="white-space:pre-wrap;padding:14px 16px;background:#f5f4fa;border-radius:10px">${esc(lead.message)}</div>
  <p style="color:#888;font-size:13px;margin-top:16px">Reply to this email to answer ${esc(lead.name)} directly.</p>
</div>`,
    });
  } catch (err) {
    console.error("[contact] sending failed", err, lead);
    return NextResponse.json(
      { error: `The message didn't go through. Please email ${site.email} or message us on WhatsApp.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
