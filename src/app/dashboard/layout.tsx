import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-h-dvh">
      <Sidebar />
      {/* Desktop: offset for sidebar. Mobile: offset for top bar + bottom tab bar */}
      <main className="flex-1 lg:ml-60 min-h-screen min-h-dvh bg-bg
                       pt-14 lg:pt-0
                       pb-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
