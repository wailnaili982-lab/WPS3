export interface ApplicationFormData {
  player_name: string;
  age: number | '';
  country: string;
  city?: string;
  language: 'ar' | 'en' | 'fr';
  play_style: 'survival' | 'building' | 'pvp' | 'adventure' | 'friends';
  additional_info?: string;
  rules_agreed: boolean;

  psn_online_id: string;
  minecraft_access: 'yes' | 'need_help';
  play_mode: 'multiplayer' | 'server_world' | 'events';
  connection_notes?: string;

  tiktok_username: string;
  tiktok_url?: string;
  join_reason: 'friends' | 'events' | 'building' | 'other';
  contact_preference: 'tiktok' | 'none';
}

export interface ApplicationRecord extends Omit<ApplicationFormData, 'age'> {
  id: string;
  age: number;
  application_status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export function sanitizeText(input: string | undefined): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // strip dangerous tags
    .slice(0, 500); // reasonable max length
}

export function formatTikTokHandle(raw: string): string {
  const cleaned = raw.trim().replace(/^@+/, '');
  return cleaned ? `@${cleaned}` : '';
}

export function isValidPsnId(psnId: string): boolean {
  if (!psnId) return false;
  const trimmed = psnId.trim();
  // PSN IDs are 3 to 16 characters, letters, numbers, underscores, and hyphens
  const regex = /^[A-Za-z0-9_-]{3,16}$/;
  return regex.test(trimmed);
}

export function isValidAge(age: number | string | ''): boolean {
  if (age === '' || age === undefined || age === null) return false;
  const num = typeof age === 'number' ? age : parseInt(age, 10);
  return !isNaN(num) && num >= 10 && num <= 85;
}

export function validateStep1(data: Partial<ApplicationFormData>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.player_name || data.player_name.trim().length < 3) {
    errors.player_name = 'اسم اللاعب يجب أن يتكون من 3 أحرف على الأقل / Player name must be at least 3 characters';
  } else if (data.player_name.trim().length > 24) {
    errors.player_name = 'اسم اللاعب طويل جدًا / Player name is too long (max 24)';
  }

  if (!isValidAge(data.age as any)) {
    errors.age = 'يرجى إدخال عمر صحيح بين 10 و 85 عامًا / Please enter a valid age between 10 and 85';
  }

  if (!data.country || data.country.trim() === '') {
    errors.country = 'يرجى اختيار بلدك / Please select your country';
  }

  if (!data.rules_agreed) {
    errors.rules_agreed = 'يجب الموافقة على قواعد السيرفر للمتابعة / You must agree to the server rules';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStep2(data: Partial<ApplicationFormData>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.psn_online_id || !isValidPsnId(data.psn_online_id)) {
    errors.psn_online_id = 'معرف PSN غير صالح (3-16 حرفًا أو رقمًا بدون مسافات) / Invalid PSN ID (3-16 characters)';
  }

  if (!data.minecraft_access) {
    errors.minecraft_access = 'يرجى تحديد إمكانية الدخول إلى Minecraft PS3 / Please specify if you can access Minecraft PS3';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStep3(data: Partial<ApplicationFormData>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const handle = formatTikTokHandle(data.tiktok_username || '');
  if (!handle || handle.length < 3) {
    errors.tiktok_username = 'يرجى إدخال اسم مستخدم TikTok صالح / Please enter a valid TikTok username';
  }

  if (data.tiktok_url && data.tiktok_url.trim().length > 0) {
    const url = data.tiktok_url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      errors.tiktok_url = 'الرابط يجب أن يبدأ بـ https:// / URL must start with https://';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateApplicationId(): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const randChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WPS3-${randNum}-${randChars}`;
}

export function applicationsToCSV(apps: ApplicationRecord[]): string {
  const headers = [
    'ID',
    'Player Name',
    'Age',
    'Country',
    'City',
    'Language',
    'Play Style',
    'PSN ID',
    'Minecraft Access',
    'TikTok Username',
    'Status',
    'Admin Notes',
    'Created At',
  ];

  const escapeCell = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = apps.map((app) => [
    escapeCell(app.id),
    escapeCell(app.player_name),
    escapeCell(app.age),
    escapeCell(app.country),
    escapeCell(app.city || ''),
    escapeCell(app.language),
    escapeCell(app.play_style),
    escapeCell(app.psn_online_id),
    escapeCell(app.minecraft_access),
    escapeCell(app.tiktok_username),
    escapeCell(app.application_status),
    escapeCell(app.admin_notes || ''),
    escapeCell(app.created_at),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
