import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <AppShell
      user={user}
      currentPath="/admin/configuracoes"
      title="Configurações"
      description="Estrutura já separada para empresa, pagamentos e trilha fiscal sem misturar isso com a operação diária."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Empresa e fiscal"
          description="A entidade Company já suporta slug, documento, IE e regime tributário."
        >
          <ul className="space-y-3 text-sm leading-7 text-slate-700">
            <li>Preparado para integração futura com NFC-e via API fiscal.</li>
            <li>Separação por `companyId` em entidades operacionais e financeiras.</li>
            <li>Espaço para certificado, XML e DANFE no modelo de invoice.</li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Pagamentos"
          description="Dinheiro, Pix e cartão já têm método e status próprios para evitar lógica acoplada."
        >
          <ul className="space-y-3 text-sm leading-7 text-slate-700">
            <li>Pix pronto para evolução com QR dinâmico e webhook.</li>
            <li>Cartão preparado para TEF ou gateway sem quebrar o domínio.</li>
            <li>Fechamento de caixa separado de venda e pagamento.</li>
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}

