import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import { db } from './src/server/db.ts';
import {
  validateStep1,
  validateStep2,
  validateStep3,
  generateApplicationId,
  formatTikTokHandle,
  sanitizeText,
  applicationsToCSV,
  ApplicationRecord,
} from './src/utils/validation.ts';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Authorized Admin Secret Password specified by user: WPS31K
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'WPS31K';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'wps3_minecraft_super_secret_session_key_2026';

// In-memory active tokens (persisted for server lifetime)
const activeTokens = new Set<string>();

function generateToken(): string {
  const token = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`admin:${Date.now()}:${Math.random()}`)
    .digest('hex');
  activeTokens.add(token);
  return token;
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'غير مصرح لك بالوصول / Unauthorized access' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!activeTokens.has(token)) {
    res.status(403).json({ error: 'الجلسة منتهية أو غير صالحة / Invalid or expired session' });
    return;
  }
  next();
}

/* ================= PUBLIC API ROUTES ================= */

// 1. Submit New Application
app.post('/api/applications', (req, res) => {
  try {
    const raw = req.body;

    // Validate Step 1
    const step1 = validateStep1(raw);
    if (!step1.isValid) {
      res.status(400).json({ error: 'بيانات اللاعب غير مكتملة', details: step1.errors });
      return;
    }

    // Validate Step 2
    const step2 = validateStep2(raw);
    if (!step2.isValid) {
      res.status(400).json({ error: 'بيانات حساب PSN غير صالحة', details: step2.errors });
      return;
    }

    // Validate Step 3
    const step3 = validateStep3(raw);
    if (!step3.isValid) {
      res.status(400).json({ error: 'بيانات TikTok غير صالحة', details: step3.errors });
      return;
    }

    const newRecord: ApplicationRecord = {
      id: generateApplicationId(),
      player_name: sanitizeText(raw.player_name),
      age: Number(raw.age),
      country: sanitizeText(raw.country),
      city: sanitizeText(raw.city) || undefined,
      language: raw.language || 'ar',
      play_style: raw.play_style || 'survival',
      additional_info: sanitizeText(raw.additional_info) || undefined,
      rules_agreed: true,

      psn_online_id: sanitizeText(raw.psn_online_id),
      minecraft_access: raw.minecraft_access || 'yes',
      play_mode: raw.play_mode || 'multiplayer',
      connection_notes: sanitizeText(raw.connection_notes) || undefined,

      tiktok_username: formatTikTokHandle(raw.tiktok_username),
      tiktok_url: sanitizeText(raw.tiktok_url) || undefined,
      join_reason: raw.join_reason || 'friends',
      contact_preference: raw.contact_preference || 'tiktok',

      application_status: 'pending',
      created_at: new Date().toISOString(),
    };

    const saved = db.create(newRecord);
    res.status(201).json({
      success: true,
      message: 'تم إرسال طلب انضمامك إلى WPS3 بنجاح!',
      application: {
        id: saved.id,
        player_name: saved.player_name,
        psn_online_id: saved.psn_online_id,
        application_status: saved.application_status,
        created_at: saved.created_at,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'حدث خطأ أثناء معالجة الطلب' });
  }
});

// 2. Public Application Status Tracker (Lookup by ID or PSN ID)
app.get('/api/applications/status/:query', (req, res) => {
  const query = req.params.query;
  const appFound = db.getById(query);
  if (!appFound) {
    res.status(404).json({ error: 'لم يتم العثور على طلب بهذا الرقم أو معرف PSN / No application found' });
    return;
  }

  // Mask PSN ID slightly for privacy (e.g. Wa***23)
  const psn = appFound.psn_online_id;
  const maskedPsn = psn.length > 4 ? `${psn.slice(0, 2)}***${psn.slice(-2)}` : `${psn.slice(0, 1)}***`;

  res.json({
    id: appFound.id,
    player_name: appFound.player_name,
    masked_psn: maskedPsn,
    status: appFound.application_status,
    admin_notes: appFound.admin_notes || null,
    created_at: appFound.created_at,
  });
});

/* ================= ADMIN AUTH & MANAGEMENT ROUTES ================= */

// Admin Login (Requires ultra-secret password WPS31K only)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'كلمة المرور السرية مطلوبة / Secret password is required' });
    return;
  }

  if (password.trim() !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'كلمة المرور السرية غير صحيحة / Incorrect secret password' });
    return;
  }

  const token = generateToken();
  res.json({
    success: true,
    token,
    role: 'admin',
    message: 'تم تسجيل الدخول بنجاح كمسؤول سيرفر WPS3',
  });
});

// Admin Get Applications
app.get('/api/admin/applications', requireAdmin, (req, res) => {
  const { status, search } = req.query;
  let apps = db.getAll();

  if (status && status !== 'all') {
    apps = apps.filter((a) => a.application_status === status);
  }

  if (search && typeof search === 'string') {
    const s = search.toLowerCase().trim();
    apps = apps.filter(
      (a) =>
        a.player_name.toLowerCase().includes(s) ||
        a.psn_online_id.toLowerCase().includes(s) ||
        a.id.toLowerCase().includes(s) ||
        a.country.toLowerCase().includes(s) ||
        a.tiktok_username.toLowerCase().includes(s)
    );
  }

  res.json({ applications: apps });
});

// Admin Get Stats
app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  const stats = db.getStats();
  res.json(stats);
});

// Admin Update Application Status & Notes
app.patch('/api/admin/applications/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  if (status && !['pending', 'approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: 'حالة غير صالحة' });
    return;
  }

  const updated = db.updateStatus(id, status, admin_notes);
  if (!updated) {
    res.status(404).json({ error: 'لم يتم العثور على الطلب' });
    return;
  }

  res.json({ success: true, application: updated });
});

// Admin Delete Application
app.delete('/api/admin/applications/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'لم يتم العثور على الطلب لحذفه' });
    return;
  }
  res.json({ success: true, message: 'تم حذف الطلب بنجاح' });
});

// Admin Export CSV
app.get('/api/admin/export', requireAdmin, (_req, res) => {
  const apps = db.getAll();
  const csv = applicationsToCSV(apps);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="WPS3_Server_Applications.csv"');
  // Include UTF-8 BOM so Excel opens Arabic correctly
  res.send('\uFEFF' + csv);
});

/* ================= VITE DEV OR STATIC SERVING ================= */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WPS3 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
