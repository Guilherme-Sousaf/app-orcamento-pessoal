import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = 'demo@orcaplus.com';
  let userName: string | null = 'Demonstração';

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userEmail = user.email || null;
      userName = (user.user_metadata?.full_name as string) || null;
    }
  } catch {
    // Modo fallback de desenvolvimento quando credenciais do Supabase ainda são demonstrativas
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Topbar userEmail={userEmail} userName={userName} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
