import MailSlurp from "mailslurp-client";
import dotenv from 'dotenv';
dotenv.config();
// use an environment variable instead of hardcoding the key
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });

export let inboxId = '';
export let testEmail = '';

export async function createInbox() {
  const inbox = await mailslurp.createInbox();
  testEmail = inbox.emailAddress;
  inboxId = inbox.id;
  return testEmail;
}

export function setInboxId(id) {
  inboxId = id;
}

export function setEmail(e) {
  testEmail = e;
}

export function getEmail() {
  return testEmail;
}

export async function getConfirmationLink({ timeout = 30000 } = {}) {
  if (!inboxId) throw new Error('inboxId not set. Call createInbox() first.');
  const email = await mailslurp.waitForLatestEmail(inboxId, timeout);
  const body = email?.body || email?.bodyPreview || '';

    // Prefer the password reset link pattern used by the app
    const resetMatch = body.match(/https?:\/\/[^\s'"]*\/accounts\/password\/reset\/key\/[^\s'"]+/i);
    if (resetMatch) return resetMatch[0];

    // Fallback: return the first URL found in the email body
    const match = body.match(/https?:\/\/[^\s'"]+/);
    if (!match) throw new Error('No confirmation link found in email body.');
    return match[0];
}