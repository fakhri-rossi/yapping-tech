import { NextResponse } from "next/server";
import { getDb, initDatabaseSchema } from "@lib/db";
import { NICHE_MAP } from "@config/niches";
import type { NicheConfig, NicheId } from "@type/landing";

/**
 * GET /api/cms/sync?niche=florist
 * Mengambil konfigurasi aktif dari Neon DB. Jika DB belum disetup, fallback ke mock config bawaan.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nicheId = searchParams.get("niche") as NicheId | null;

  if (!nicheId || !NICHE_MAP[nicheId]) {
    return NextResponse.json({ error: "Niche tidak valid" }, { status: 400 });
  }

  const sql = getDb();
  if (!sql) {
    // Mode fallback: Menggunakan konfigurasi statis jika Neon belum dihubungkan
    return NextResponse.json({
      source: "local-fallback",
      config: NICHE_MAP[nicheId],
    });
  }

  try {
    const rows = await sql`
      SELECT config_json FROM client_niche_settings WHERE niche_id = ${nicheId} LIMIT 1
    `;

    if (rows.length > 0 && rows[0].config_json) {
      return NextResponse.json({
        source: "neon-db",
        config: rows[0].config_json as NicheConfig,
      });
    }

    // Jika belum ada record di DB, kembalikan default
    return NextResponse.json({
      source: "neon-default",
      config: NICHE_MAP[nicheId],
    });
  } catch (error) {
    console.error("Gagal membaca dari Neon DB:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari database", fallback: NICHE_MAP[nicheId] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/sync
 * Menyimpan perubahan CMS dari dashboard ke Neon DB secara persistent.
 * Body: { nicheId: string, config: NicheConfig, secretKey?: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nicheId, config, secretKey } = body as {
      nicheId: NicheId;
      config: NicheConfig;
      secretKey?: string;
    };

    if (!nicheId || !config) {
      return NextResponse.json({ error: "Parameter nicheId dan config wajib diisi" }, { status: 400 });
    }

    // Validasi security opsional jika ADMIN_SECRET_KEY di-set di .env
    const expectedSecret = process.env.ADMIN_SECRET_KEY;
    if (expectedSecret && secretKey !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized: Secret key salah" }, { status: 401 });
    }

    const sql = getDb();
    if (!sql) {
      return NextResponse.json(
        {
          error: "DATABASE_URL belum diatur di server. Silakan hubungkan Neon DB terlebih dahulu.",
        },
        { status: 503 }
      );
    }

    // Pastikan schema tabel sudah dibuat
    await initDatabaseSchema();

    // Upsert konfigurasi ke Neon
    await sql`
      INSERT INTO client_niche_settings (niche_id, client_name, config_json, updated_at)
      VALUES (${nicheId}, ${config.brand}, ${JSON.stringify(config)}, CURRENT_TIMESTAMP)
      ON CONFLICT (niche_id)
      DO UPDATE SET
        client_name = EXCLUDED.client_name,
        config_json = EXCLUDED.config_json,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json({
      success: true,
      message: `Konfigurasi CMS untuk ${nicheId} berhasil disimpan secara permanen di Neon.`,
    });
  } catch (error) {
    console.error("Gagal menyimpan ke Neon DB:", error);
    return NextResponse.json({ error: "Internal Server Error saat menyimpan data" }, { status: 500 });
  }
}
