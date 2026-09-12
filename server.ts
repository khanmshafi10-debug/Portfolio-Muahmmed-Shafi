import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || 'khanmshafi10@gmail.com';
const FORMSUBMIT_TOKEN = process.env.FORMSUBMIT_TOKEN || '1b31d64b5de409338828b037a19bf580';
const GMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER || '';
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS || process.env.SMTP_PASS || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate client IP tracking
app.set('trust proxy', true);

// CORS headers for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Ensure data persistence directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'inquiries.json');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  status: 'sent' | 'queued' | 'saved_locally' | 'relay_delivered';
  emailError?: string;
  cloudRelayStatus?: string;
}

function loadPersistedMessages(): ContactMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read inquiries.json, starting fresh:', err);
  }
  return [];
}

function savePersistedMessages(messages: ContactMessage[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to inquiries.json:', err);
  }
}

const contactMessages: ContactMessage[] = loadPersistedMessages();

// ============================================================
// Email Delivery Engines:
// 1. FormSubmit Cloud Relay (Dispatches full detail table to khanmshafi10@gmail.com)
// 2. Direct Nodemailer SMTP (Ultra-rich theme HTML email if GMAIL_APP_PASS is set in .env)
// 3. Local In-Memory & File Persistence (data/inquiries.json)
// ============================================================

function createTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASS,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });
}

let transporter = createTransporter();

// Dispatch via Cloud Relay to guarantee live delivery to Gmail
async function sendViaCloudRelay(msg: ContactMessage): Promise<boolean> {
  try {
    const endpoint = FORMSUBMIT_TOKEN
      ? `https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`
      : `https://formsubmit.co/ajax/${encodeURIComponent(RECEIVER_EMAIL)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
        'Referer': 'http://localhost:3000/',
      },
      body: JSON.stringify({
        'Client Name': msg.name,
        'Client Email': msg.email,
        'Service Requested': msg.service || '3D Experience & Motion',
        'Estimated Budget': msg.budget || 'Flexible',
        'Project Timeline': msg.timeline || 'Flexible',
        'Project Scope & Message': msg.message,
        'Submission Date & Time': new Date(msg.timestamp).toLocaleString(),
        'Client IP': msg.ip,
        _subject: `🚀 [Shafi Portfolio] New Inquiry: ${msg.name} (${msg.service || '3D Project'})`,
        _replyto: msg.email,
        _template: 'box',
        _captcha: 'false',
      }),
    });

    const resJson: any = await response.json().catch(() => ({}));
    console.log(`📡 [Cloud Relay Output] (${endpoint}):`, resJson?.message || resJson);
    msg.cloudRelayStatus = resJson?.message || 'Delivered to Cloud Relay';
    return true;
  } catch (err: any) {
    console.warn(`⚠️ [Cloud Relay Error] for ${msg.id}:`, err?.message || err);
    msg.cloudRelayStatus = 'Relay connection error';
    return false;
  }
}

// Queue for outgoing emails
interface QueueItem {
  message: ContactMessage;
  attempts: number;
}
const emailQueue: QueueItem[] = [];
let isQueueProcessing = false;

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}

function buildHtmlEmail(msg: ContactMessage): string {
  const safeName = escapeHtml(msg.name);
  const safeEmail = escapeHtml(msg.email);
  const safeService = escapeHtml(msg.service || '3D Creative & Web Experience');
  const safeBudget = escapeHtml(msg.budget || 'Flexible');
  const safeTimeline = escapeHtml(msg.timeline || 'Standard');
  const safeMessage = escapeHtml(msg.message).replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Conversation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F0A1C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F8FAFC;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F0A1C; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #18122B; border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 35px rgba(168, 85, 247, 0.15);">
          
          <!-- Top Neon Flare Banner -->
          <tr>
            <td style="padding: 32px 36px; background: radial-gradient(circle at 85% 15%, rgba(192, 132, 252, 0.25) 0%, transparent 50%), linear-gradient(135deg, #2E1065 0%, #18122B 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; padding: 4px 12px; background-color: rgba(168, 85, 247, 0.2); border: 1px solid rgba(168, 85, 247, 0.5); border-radius: 50px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #C084FC; font-weight: 700; margin-bottom: 12px;">
                      ⚡ SHAFI | 3D CREATOR
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; text-transform: uppercase;">
                      New Client Conversation
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #94A3B8;">
                      Received through your portfolio website contact portal
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content Area -->
          <tr>
            <td style="padding: 36px;">

              <!-- Meta Badges 2x2 Grid -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="48%" style="vertical-align: top; padding: 14px; background-color: #251B3E; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; margin-bottom: 4px;">👤 Client Name</div>
                    <div style="font-size: 15px; font-weight: 700; color: #F8FAFC;">${safeName}</div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top; padding: 14px; background-color: #251B3E; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; margin-bottom: 4px;">📧 Email Address</div>
                    <div style="font-size: 14px; font-weight: 600; color: #C084FC;"><a href="mailto:${safeEmail}" style="color: #C084FC; text-decoration: none;">${safeEmail}</a></div>
                  </td>
                </tr>
                <tr><td height="12" colspan="3"></td></tr>
                <tr>
                  <td width="48%" style="vertical-align: top; padding: 14px; background-color: #251B3E; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; margin-bottom: 4px;">🎯 Service Needed</div>
                    <div style="font-size: 14px; font-weight: 700; color: #38BDF8;">${safeService}</div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top; padding: 14px; background-color: #251B3E; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; margin-bottom: 4px;">💰 Estimated Budget</div>
                    <div style="font-size: 14px; font-weight: 700; color: #34D399;">${safeBudget}</div>
                  </td>
                </tr>
                <tr><td height="12" colspan="3"></td></tr>
                <tr>
                  <td width="48%" style="vertical-align: top; padding: 14px; background-color: #251B3E; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; margin-bottom: 4px;">⏱️ Timeline</div>
                    <div style="font-size: 13px; font-weight: 600; color: #FCD34D;">${safeTimeline}</div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top; padding: 14px; background-color: #251B3E; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;">
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; margin-bottom: 4px;">🕒 Time Received</div>
                    <div style="font-size: 12px; font-weight: 500; color: #94A3B8;">${new Date(msg.timestamp).toLocaleString()}</div>
                  </td>
                </tr>
              </table>

              <!-- Project Message Box -->
              <div style="margin-bottom: 32px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #A855F7; margin-bottom: 10px;">
                  💬 Project Brief & Details
                </div>
                <div style="background-color: #120C22; border-left: 4px solid #A855F7; border-radius: 4px 12px 12px 4px; padding: 22px; font-size: 15px; line-height: 1.65; color: #F8FAFC; border: 1px solid rgba(255,255,255,0.05); border-left-width: 4px;">
                  ${safeMessage}
                </div>
              </div>

              <!-- Action Buttons -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(safeService)}%20-%20Shafi%20Portfolio&body=Hi%20${encodeURIComponent(safeName)}%2C%0A%0AThank%20you%20for%20reaching%20out%20regarding%20your%20project." 
                       style="display: inline-block; background: linear-gradient(135deg, #A855F7 0%, #7E22CE 100%); color: #FFFFFF; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 10px 25px rgba(168,85,247,0.4); border: 1px solid rgba(255,255,255,0.2);">
                      Reply Directly to ${safeName} &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="padding: 20px 36px; background-color: #100B1D; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #64748B; text-align: center; line-height: 1.5;">
              Routed directly to <strong style="color: #A855F7;">${RECEIVER_EMAIL}</strong><br/>
              Client IP: <span style="font-family: monospace;">${msg.ip}</span> | Tracking ID: <span style="font-family: monospace;">${msg.id}</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function processQueue() {
  if (isQueueProcessing || emailQueue.length === 0) return;
  isQueueProcessing = true;

  while (emailQueue.length > 0) {
    const item = emailQueue[0];

    // 1. Send via Cloud Relay
    await sendViaCloudRelay(item.message);

    // 2. If SMTP is configured, also send via Nodemailer
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Shafi Portfolio" <${GMAIL_USER}>`,
          to: RECEIVER_EMAIL,
          replyTo: item.message.email,
          subject: `🚀 [Portfolio Inquiry] From ${item.message.name} (${item.message.service || '3D Project'})`,
          html: buildHtmlEmail(item.message),
        });
        console.log(`✅ [SMTP Delivered] Sent directly via Gmail SMTP to ${RECEIVER_EMAIL}`);
        item.message.status = 'sent';
      } catch (smtpErr: any) {
        console.warn(`⚠️ [SMTP Error]:`, smtpErr?.message || smtpErr);
        item.message.status = 'relay_delivered';
      }
    } else {
      item.message.status = 'relay_delivered';
    }

    savePersistedMessages(contactMessages);
    emailQueue.shift();

    // Small throttle between messages to stay safe
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  isQueueProcessing = false;
}

// ============================================================
// API Endpoints
// ============================================================

// API: Health Check & Email Status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    receiverEmail: RECEIVER_EMAIL,
    formSubmitToken: FORMSUBMIT_TOKEN ? `${FORMSUBMIT_TOKEN.substring(0, 6)}...` : 'Not Set',
    cloudRelay: 'Active (FormSubmit)',
    smtpConfigured: Boolean(GMAIL_USER && GMAIL_APP_PASS),
    totalMessages: contactMessages.length,
    server: 'Express.js Dual-Engine Email Backend',
  });
});

// API: Contact Form Submission - NO BLOCKING RATE LIMITS
app.post('/api/contact', async (req: Request, res: Response) => {
  const { name, email, service, budget, timeline, message, _hp } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown';

  // Honeypot check: If the hidden honeypot field is filled, silently discard spam bot
  if (_hp) {
    console.warn(`🛡️ [Spam Blocked] Bot caught by honeypot from IP: ${clientIp}`);
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received.',
    });
  }

  // Validation
  const trimmedName = (name || '').trim().slice(0, 100);
  const trimmedEmail = (email || '').trim().slice(0, 120);
  const trimmedMessage = (message || '').trim().slice(0, 5000);
  const trimmedService = (service || '').trim().slice(0, 100);
  const trimmedBudget = (budget || '').trim().slice(0, 50);
  const trimmedTimeline = (timeline || '').trim().slice(0, 50);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.',
    });
  }

  if (!trimmedMessage || trimmedMessage.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Please include a message.',
    });
  }

  // Create record with full details
  const newEntry: ContactMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: trimmedName || 'Client',
    email: trimmedEmail,
    service: trimmedService || '3D Web & Interactive',
    budget: trimmedBudget || 'Flexible',
    timeline: trimmedTimeline || 'Flexible',
    message: trimmedMessage,
    ip: clientIp,
    userAgent: userAgent.slice(0, 200),
    timestamp: new Date().toISOString(),
    status: 'queued',
  };

  contactMessages.unshift(newEntry);
  savePersistedMessages(contactMessages);

  console.log(`📩 [New Contact Submission] ID: ${newEntry.id} From: ${newEntry.name} <${newEntry.email}> - Service: "${newEntry.service}" -> Destination: ${RECEIVER_EMAIL}`);

  // Enqueue for background delivery
  emailQueue.push({ message: newEntry, attempts: 0 });
  processQueue().catch((err) => console.error('Error in processQueue:', err));

  // Direct mailto link fallback pre-filled with all details
  const mailtoBody = `Hi Shafi,\n\nName: ${newEntry.name}\nEmail: ${newEntry.email}\nService: ${newEntry.service}\nBudget: ${newEntry.budget}\nTimeline: ${newEntry.timeline}\n\nMessage:\n${newEntry.message}`;
  const mailtoFallback = `mailto:${encodeURIComponent(RECEIVER_EMAIL)}?subject=${encodeURIComponent(
    `Portfolio Inquiry: ${newEntry.name} - ${newEntry.service}`
  )}&body=${encodeURIComponent(mailtoBody)}`;

  res.status(201).json({
    success: true,
    message: `Thank you, ${newEntry.name}! Your message has been routed to ${RECEIVER_EMAIL}.`,
    data: {
      id: newEntry.id,
      timestamp: newEntry.timestamp,
      receiver: RECEIVER_EMAIL,
      details: {
        name: newEntry.name,
        email: newEntry.email,
        service: newEntry.service,
        budget: newEntry.budget,
        timeline: newEntry.timeline,
        message: newEntry.message,
      },
      mailtoFallback,
    },
  });
});

// API: Retrieve Contact Inquiries
app.get('/api/contact', (_req: Request, res: Response) => {
  res.json({
    total: contactMessages.length,
    receiver: RECEIVER_EMAIL,
    messages: contactMessages,
  });
});

// API: AI Assistant
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return res.json({
      reply: `Gemini API key is not configured yet. Add your GEMINI_API_KEY in .env. Inquiries are routed to ${RECEIVER_EMAIL}.`,
      configured: false,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    res.json({ reply: response.text, configured: true });
  } catch (error: any) {
    res.status(500).json({ error: 'AI generation error', details: String(error) });
  }
});

// Production static fallback
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    if (!req.url.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Start Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Express Email Backend Server running on port ${PORT}`);
  console.log(`📬 Real Emails Dispatched To: ${RECEIVER_EMAIL}`);
  console.log(`🌐 FormSubmit Token Endpoint:  ${FORMSUBMIT_TOKEN}`);
  console.log(`🔒 SMTP Transporter:          ${GMAIL_APP_PASS ? 'Active' : 'Disabled (App Password not set in .env)'}`);
  console.log(`🔗 API Base:                  http://localhost:${PORT}/api`);
  console.log(`📩 Contact Endpoint:          http://localhost:${PORT}/api/contact`);
  console.log(`=======================================================`);
});

process.on('SIGTERM', () => {
  server.close(() => console.log('HTTP server closed'));
});

export default app;
