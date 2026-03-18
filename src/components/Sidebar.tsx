"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Wallet, Receipt, BarChart3,
  Settings, TrendingUp, Menu, X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Budgets",   href: "/dashboard/budgets",  icon: Wallet },
  { label: "Expenses",  href: "/dashboard/expenses", icon: Receipt },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

/* ── Desktop sidebar ──────────────────────────────────── */
function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-bg-secondary border-r border-border flex-col z-30">
      <Logo />
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <NavLink key={href} href={href} label={label} Icon={Icon} active={pathname === href} />
        ))}
      </nav>
      <div className="px-3 pb-4 border-t border-border pt-4">
        <NavLink href="/dashboard/settings" label="Settings" Icon={Settings} active={pathname === "/dashboard/settings"} />
      </div>
    </aside>
  );
}

/* ── Mobile top bar + slide-in drawer ────────────────── */
function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  // close on route change
  useEffect(() => { setOpen(false); }, [pathname]);
  // prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-secondary border-b border-border flex items-center px-4 z-40 safe-top">
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary hover:bg-bg-hover transition-colors touch-manipulation"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mx-auto">
          <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-base font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Ledger
          </span>
        </div>
        {/* spacer to balance burger */}
        <div className="w-9" />
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-bg-secondary border-r border-border z-50 flex flex-col
          transition-transform duration-300 ease-in-out safe-top
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-text-dim hover:bg-bg-hover transition-colors touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <NavLink key={href} href={href} label={label} Icon={Icon} active={pathname === href} mobile />
          ))}
        </nav>
        <div className="px-3 pb-6 border-t border-border pt-4 safe-bottom">
          <NavLink href="/dashboard/settings" label="Settings" Icon={Settings} active={pathname === "/dashboard/settings"} mobile />
        </div>
      </div>

      {/* Bottom tab bar */}
      <BottomTabBar pathname={pathname} />
    </>
  );
}

/* ── Bottom tab bar (phones) ──────────────────────────── */
function BottomTabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border z-[50] safe-bottom"
         style={{ height: "calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0px))" }}>
      <div className="flex h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors touch-manipulation
                ${active ? "text-accent" : "text-text-dim hover:text-text-secondary"}`}
            >
              <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Shared sub-components ────────────────────────────── */
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
        <TrendingUp className="w-4 h-4 text-accent" />
      </div>
      <span className="text-lg font-bold text-text-primary tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        Ledger
      </span>
    </div>
  );
}

function NavLink({
  href, label, Icon, active, mobile,
}: {
  href: string; label: string; Icon: React.ElementType; active: boolean; mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 rounded-xl text-sm font-medium transition-all duration-150
        ${mobile ? "py-3.5" : "py-2.5"}
        ${active ? "bg-accent/15 text-accent" : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"}
        touch-manipulation`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </Link>
  );
}

/* ── Main export ──────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <DesktopSidebar pathname={pathname} />
      <MobileNav pathname={pathname} />
    </>
  );
}
