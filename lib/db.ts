import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Neon Serverless SQL Client
 * 
 * Menggunakan @neondatabase/serverless yang sangat optimal untuk
 * Next.js Edge / Serverless functions di Vercel tanpa connection pool overhead.
 */
let sqlClient: NeonQueryFunction<false, false> | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // Mode offline / demo showcase jika env belum diisi
    return null;
  }

  if (!sqlClient) {
    sqlClient = neon(databaseUrl);
  }

  return sqlClient;
}

/**
 * Helper untuk inisialisasi tabel pertama kali (Auto Schema Migration)
 */
export async function initDatabaseSchema() {
  const sql = getDb();
  if (!sql) {
    throw new Error("DATABASE_URL belum dikonfigurasi di environment variable.");
  }

  // Tabel untuk menyimpan data override CMS per niche/klien
  await sql`
    CREATE TABLE IF NOT EXISTS client_niche_settings (
      niche_id VARCHAR(64) PRIMARY KEY,
      client_name VARCHAR(128),
      config_json JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Tabel untuk riwayat pesanan dari form pemesanan
  await sql`
    CREATE TABLE IF NOT EXISTS client_orders (
      id SERIAL PRIMARY KEY,
      niche_id VARCHAR(64) NOT NULL,
      customer_name VARCHAR(128) NOT NULL,
      customer_phone VARCHAR(32) NOT NULL,
      order_details JSONB NOT NULL,
      total_amount NUMERIC(15, 2) DEFAULT 0,
      status VARCHAR(32) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  return { success: true, message: "Database schema berhasil diinisialisasi." };
}
