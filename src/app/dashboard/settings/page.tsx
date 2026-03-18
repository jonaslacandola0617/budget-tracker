"use client";

import { useState } from "react";
import { Database, Info, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  const handleSeed = async () => {
    if (!confirm("This will add sample data to your database. Continue?")) return;
    setSeeding(true);
    await fetch("/api/seed", { method: "POST" });
    setSeeding(false);
    setSeedDone(true);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">App configuration and info</p>
      </div>

      {/* Database */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <Database className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-text-primary">Database</p>
            <p className="text-xs text-text-secondary">PostgreSQL via Vercel Postgres + Prisma</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "ORM", value: "Prisma 5" },
            { label: "Provider", value: "Vercel Postgres" },
            { label: "Connection", value: "Pooled (PgBouncer)" },
            { label: "Environment", value: process.env.NODE_ENV ?? "—" },
          ].map((row) => (
            <div key={row.label} className="bg-bg-secondary rounded-xl px-3 py-2.5">
              <p className="text-xs text-text-dim">{row.label}</p>
              <p className="text-text-primary font-medium mt-0.5">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample data */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
            <Info className="w-4 h-4 text-warning" />
          </div>
          <div>
            <p className="font-semibold text-text-primary">Sample Data</p>
            <p className="text-xs text-text-secondary">Seed the database with demo budgets and expenses</p>
          </div>
        </div>
        {seedDone ? (
          <div className="px-3 py-2.5 bg-success/10 border border-success/20 rounded-lg text-sm text-success">
            ✓ Sample data added successfully. Refresh the dashboard to see it.
          </div>
        ) : (
          <button onClick={handleSeed} disabled={seeding} className="btn-primary w-full">
            {seeding ? "Seeding…" : "Seed Sample Data"}
          </button>
        )}
      </div>

      {/* Links */}
      <div className="card p-5 space-y-3">
        <p className="font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
          Resources
        </p>
        {[
          { label: "Prisma Studio", href: "#", note: "Run `npm run db:studio` locally" },
          { label: "Vercel Dashboard", href: "https://vercel.com/dashboard" },
          { label: "Prisma Docs", href: "https://www.prisma.io/docs" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-bg-hover transition-colors"
          >
            <div>
              <p className="text-sm text-text-primary">{link.label}</p>
              {link.note && <p className="text-xs text-text-dim">{link.note}</p>}
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-text-dim" />
          </a>
        ))}
      </div>
    </div>
  );
}
