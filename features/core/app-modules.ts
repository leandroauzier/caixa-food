import type { AppModule, Role } from "@/types/domain";

export const appModules: AppModule[] = [
  {
    title: "Superadmin",
    description: "Empresas, usuarios e dados globais.",
    href: "/superadmin",
    accent: "from-violet-300 via-purple-400 to-indigo-500",
    allowedRoles: ["SUPERADMIN"],
  },
  {
    title: "Admin",
    description: "Cadastro, estoque, usuarios e relatorios.",
    href: "/admin",
    accent: "from-amber-300 via-orange-400 to-rose-500",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    title: "PDV",
    description: "Pedido rapido, carrinho e fechamento de venda.",
    href: "/pdv",
    accent: "from-emerald-300 via-teal-400 to-cyan-500",
    allowedRoles: ["SUPERADMIN", "ADMIN", "CAIXA", "ATENDENTE"],
  },
  {
    title: "Cozinha",
    description: "Fila operacional com status e observacoes.",
    href: "/cozinha",
    accent: "from-sky-300 via-blue-400 to-indigo-500",
    allowedRoles: ["SUPERADMIN", "ADMIN", "COZINHA"],
  },
  {
    title: "Cardapio",
    description: "Vitrine publica pronta para evoluir para QR Code.",
    href: "/cardapio",
    accent: "from-fuchsia-300 via-pink-400 to-rose-500",
    allowedRoles: "all",
  },
];

export function canViewAppModule(
  role: Role | null | undefined,
  module: AppModule,
) {
  if (!role) {
    return false;
  }

  if (role === "SUPERADMIN") {
    return true;
  }

  if (module.allowedRoles === "all") {
    return true;
  }

  return module.allowedRoles.includes(role);
}

export function getVisibleAppModules(role: Role | null | undefined) {
  return appModules.filter((module) => canViewAppModule(role, module));
}

export function getRoleHomeHref(role: Role | null | undefined) {
  switch (role) {
    case "SUPERADMIN":
      return "/superadmin";
    case "ADMIN":
      return "/admin";
    case "COZINHA":
      return "/cozinha";
    case "CAIXA":
    case "ATENDENTE":
      return "/pdv";
    default:
      return "/";
  }
}
