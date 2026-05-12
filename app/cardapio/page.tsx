import { MenuList } from "@/components/cardapio/menu-list";
import { getPublicMenuCatalog } from "@/features/catalog/dal";

export default async function MenuPage() {
  const menuCatalog = await getPublicMenuCatalog();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(240,249,255,0.96),_rgba(254,240,138,0.55))] px-3 py-5 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <header className="overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#0f172a,#155e75,#10b981)] px-4 py-5 text-white shadow-2xl sm:px-6 sm:py-7">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-100">
                Cardapio digital
              </p>
              <h1 className="mt-3 max-w-4xl font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Bonito de ver, facil de pedir e claro ate para quem acabou de chegar.
              </h1>
              <p className="mt-3 max-w-2xl text-xs leading-6 text-cyan-50/90 sm:text-sm sm:leading-7">
                Cada item traz imagem, preco direto, extras disponiveis e porcoes maiores
                quando existirem. A ideia aqui e reduzir atrito e acelerar a escolha.
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-100">
                Hoje no menu
              </p>
              <p className="mt-2 font-heading text-3xl">{menuCatalog.products.length}</p>
              <p className="mt-2 text-xs leading-5 text-cyan-50/90 sm:text-sm sm:leading-6">
                produtos ativos distribuidos em {menuCatalog.categories.length} categorias.
              </p>
            </div>
          </div>
        </header>

        <MenuList
          categories={menuCatalog.categories}
          products={menuCatalog.products}
        />
      </div>
    </div>
  );
}
