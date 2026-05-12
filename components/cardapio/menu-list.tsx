import { ProductImage } from "@/components/ui/product-image";
import { formatMoney } from "@/lib/money";
import type { CategorySummary, ProductSummary } from "@/types/domain";

export function MenuList({
  categories,
  products,
}: {
  categories: CategorySummary[];
  products: ProductSummary[];
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.categoryId === category.id,
        );

        return (
          <section
            key={category.id}
            className="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-5"
          >
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
                  Categoria
                </p>
                <h2 className="mt-2 font-heading text-2xl text-slate-950 sm:text-3xl">
                  {category.name}
                </h2>
                <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">
                  {category.description}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
                {categoryProducts.length} opcoes
              </span>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {categoryProducts.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-[22px] border border-slate-100 bg-[linear-gradient(135deg,rgba(248,250,252,1),rgba(255,255,255,0.92),rgba(240,249,255,0.9))] shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="grid gap-3 p-3 sm:grid-cols-[132px_minmax(0,1fr)]">
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-28 sm:h-32"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-xl text-slate-950 sm:text-2xl">
                            {product.name}
                          </h3>
                          <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                            {product.description}
                          </p>
                        </div>
                        <p className="font-heading text-2xl text-slate-950">
                          {formatMoney(product.price)}
                        </p>
                      </div>

                      {product.options.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {product.options.map((option) => (
                            <span
                              key={option.id}
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold sm:text-xs ${
                                option.kind === "PORTION"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-sky-100 text-sky-800"
                              }`}
                            >
                              {option.kind === "PORTION" ? "Porcao" : "Extra"}{" "}
                              {option.name}
                              {option.price > 0 ? ` / ${formatMoney(option.price)}` : ""}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xs text-slate-500 sm:text-sm">
                          Feito para pedir com menos duvida e mais agilidade.
                        </p>
                        <span className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                          Em destaque
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
