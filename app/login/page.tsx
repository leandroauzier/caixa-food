import { SectionCard } from "@/components/ui/section-card";
import { demoSessionUser } from "@/features/core/demo-data";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.96),_rgba(226,232,240,0.88),_rgba(191,219,254,0.62))] px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Autenticação e autorização
          </p>
          <h1 className="mt-3 font-heading text-4xl text-slate-950">
            Fluxo preparado para sessão assinada e roles por ação.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Nesta base, as páginas funcionam em `DEMO_MODE`, mas já existe
            infraestrutura para cookie de sessão assinado, verificação por role,
            validação server-side e isolamento multiempresa.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Sessão demo"
            description="Usada para navegar no MVP sem depender de banco logo no primeiro passo."
          >
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                Usuário atual: <strong>{demoSessionUser.name}</strong>
              </p>
              <p>
                Empresa: <strong>{demoSessionUser.companyName}</strong>
              </p>
              <p>
                Role: <strong>{demoSessionUser.role}</strong>
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Checklist de endurecimento"
            description="Pontos importantes para reduzir CSRF, IDOR, vazamento de dados e erros de autorização."
          >
            <ul className="space-y-3 text-sm leading-7 text-slate-700">
              <li>Revalidar autenticação dentro de cada Server Action.</li>
              <li>Checar ownership e `companyId` em toda mutação de recurso.</li>
              <li>Guardar senha com Argon2id em vez de hash simplificado.</li>
              <li>Retornar DTOs mínimos, nunca registros crus do Prisma.</li>
              <li>Manter segredos apenas na camada server-only.</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
