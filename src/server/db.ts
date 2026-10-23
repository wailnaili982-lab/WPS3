import fs from 'node:fs';
import path from 'node:path';
import { ApplicationRecord } from '../utils/validation.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'server_applications.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize empty array for real player registrations
const INITIAL_APPLICATIONS: ApplicationRecord[] = [];

function readDB(): ApplicationRecord[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(INITIAL_APPLICATIONS);
      return INITIAL_APPLICATIONS;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading DB file:', err);
    return [];
  }
}

function writeDB(data: ApplicationRecord[]): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

export const db = {
  getAll(): ApplicationRecord[] {
    return readDB();
  },

  getById(id: string): ApplicationRecord | undefined {
    const apps = readDB();
    const cleanId = id.trim().toUpperCase();
    return apps.find((a) => a.id.toUpperCase() === cleanId || a.psn_online_id.toLowerCase() === cleanId.toLowerCase());
  },

  create(record: ApplicationRecord): ApplicationRecord {
    const apps = readDB();
    // check if duplicate pending application with same PSN exists
    const existing = apps.find(
      (a) => a.psn_online_id.toLowerCase() === record.psn_online_id.toLowerCase() && a.application_status === 'pending'
    );
    if (existing) {
      throw new Error(`طلب قيد المراجعة مسجل مسبقًا لمعرف PSN هذا (${record.psn_online_id}) / A pending application already exists for this PSN ID.`);
    }

    apps.unshift(record);
    writeDB(apps);
    return record;
  },

  updateStatus(id: string, status: 'pending' | 'approved' | 'rejected', adminNotes?: string): ApplicationRecord | null {
    const apps = readDB();
    const index = apps.findIndex((a) => a.id.toUpperCase() === id.toUpperCase());
    if (index === -1) return null;

    apps[index] = {
      ...apps[index],
      application_status: status,
      admin_notes: adminNotes !== undefined ? adminNotes : apps[index].admin_notes,
      updated_at: new Date().toISOString(),
    };

    writeDB(apps);
    return apps[index];
  },

  delete(id: string): boolean {
    const apps = readDB();
    const initialLen = apps.length;
    const filtered = apps.filter((a) => a.id.toUpperCase() !== id.toUpperCase());
    if (filtered.length !== initialLen) {
      writeDB(filtered);
      return true;
    }
    return false;
  },

  getStats() {
    const apps = readDB();
    return {
      total: apps.length,
      pending: apps.filter((a) => a.application_status === 'pending').length,
      approved: apps.filter((a) => a.application_status === 'approved').length,
      rejected: apps.filter((a) => a.application_status === 'rejected').length,
      countries: apps.reduce<Record<string, number>>((acc, app) => {
        acc[app.country] = (acc[app.country] || 0) + 1;
        return acc;
      }, {}),
      playStyles: apps.reduce<Record<string, number>>((acc, app) => {
        acc[app.play_style] = (acc[app.play_style] || 0) + 1;
        return acc;
      }, {}),
    };
  },
};
