import { KitchenColumn } from "@/components/cozinha/kitchen-column";
import { AppShell } from "@/components/layout/app-shell";
import { getKitchenBoard } from "@/features/orders/dal";
import { requireRoles } from "@/lib/auth";

export default async function KitchenPage() {
  const user = await requireRoles(["SUPERADMIN", "ADMIN", "COZINHA"]);
  const board = await getKitchenBoard();

  return (
    <AppShell
      user={user}
      currentPath="/cozinha"
      title="Cozinha / KDS"
      description="Fluxo operacional direto: receber pedido, iniciar preparo e marcar como pronto."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KitchenColumn title="Novos" orders={board.newOrders} />
        <KitchenColumn title="Em preparo" orders={board.preparingOrders} />
        <KitchenColumn title="Prontos" orders={board.readyOrders} />
      </div>
    </AppShell>
  );
}
