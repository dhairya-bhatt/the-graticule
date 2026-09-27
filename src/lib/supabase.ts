import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE = 'graticule_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  // 1. Check Vite environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  // 2. Check localStorage (for in-browser configuration via Admin Settings)
  const saved = localStorage.getItem(STORAGE_KEY_SUPABASE);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
      }
    } catch (e) {}
  }

  return null;
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify({
    url: url.trim(),
    anonKey: anonKey.trim()
  }));
  // Reset client instance
  _supabaseClient = null;
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_SUPABASE);
  _supabaseClient = null;
}

let _supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabaseClient) return _supabaseClient;
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    _supabaseClient = createClient(config.url, config.anonKey);
    return _supabaseClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConnected(): boolean {
  return !!getSupabaseConfig();
}

/**
 * Tests the connection to Supabase by pinging the posts or health table
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'No Supabase URL or Anon Key configured.' };
  }

  try {
    const { data, error } = await client.from('posts').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, but credentials connected
      if (error.code === '42P01') {
        return { 
          success: true, 
          message: 'Connected to Supabase project! (Tables not yet initialized — please run supabase_schema.sql)' 
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: `Connected to Supabase successfully! Found ${data ? data.length : 0} articles.` };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed' };
  }
}
