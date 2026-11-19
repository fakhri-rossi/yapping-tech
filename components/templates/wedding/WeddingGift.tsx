"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { WeddingConfig } from "@type/wedding";

interface WeddingGiftProps {
  config: WeddingConfig;
}

export function WeddingGift({ config }: WeddingGiftProps) {
  const { theme, bankAccounts } = config;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {});
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Section kicker */}
        <motion.p
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: theme.textMuted }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Hadiah Pernikahan
        </motion.p>

        <motion.p
          className="text-sm leading-relaxed mb-8 max-w-md mx-auto"
          style={{ color: theme.textMuted }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun
          jika Anda ingin memberikan tanda kasih, kami menyediakan informasi di
          bawah ini.
        </motion.p>

        {/* Bank Account Cards */}
        <div className="space-y-4 mb-8">
          {bankAccounts.map((account, i) => (
            <motion.div
              key={account.accountNumber}
              className="p-5 rounded-xl text-center"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.primary}15`,
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: theme.textMuted }}>
                {account.bank}
              </p>
              <p
                className="text-xl md:text-2xl tracking-wider font-light mb-1"
                style={{ fontFamily: "ui-monospace, monospace", color: theme.text }}
              >
                {account.accountNumber}
              </p>
              <p className="text-xs mb-4" style={{ color: theme.textMuted }}>
                a.n. {account.accountName}
              </p>

              <button
                onClick={() => handleCopy(account.accountNumber, `bank-${i}`)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all"
                style={{
                  backgroundColor: copiedId === `bank-${i}` ? `${theme.primary}` : `${theme.primary}10`,
                  color: copiedId === `bank-${i}` ? "#FFFFFF" : theme.primary,
                  border: `1.5px solid ${theme.primary}30`,
                }}
              >
                {copiedId === `bank-${i}` ? (
                  <>✓ Berhasil Disalin!</>
                ) : (
                  <>📋 Salin Nomor Rekening</>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
