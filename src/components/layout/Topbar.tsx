'use client';

import React from 'react';
import { User, Bell } from 'lucide-react';

interface TopbarProps {
  userEmail?: string | null;
  userName?: string | null;
}

export function Topbar({ userEmail, userName }: TopbarProps) {
  const displayName = userName || (userEmail ? userEmail.split('@')[0] : 'Usuário');

  return (
    <header className="h-20 border-b border-white/5 bg-slate-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-slate-400">
          Bem-vindo de volta, <span className="text-slate-100 font-semibold">{displayName}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200">{displayName}</p>
            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
