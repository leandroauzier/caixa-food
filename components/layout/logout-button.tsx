"use client";

import { logoutAction } from "@/app/logout/action";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="mt-2 w-full rounded-xl px-3 py-2 text-left text-xs text-slate-400 transition hover:bg-white/8 hover:text-red-300"
      >
        Sair
      </button>
    </form>
  );
}
