import { formatMoney } from "@/lib/money";
import type { ProductSummary } from "@/types/domain";

export function ProductTable({ products }: { products: ProductSummary[] }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Produto</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Preço</th>
            <th className="px-4 py-3 font-medium">Estoque</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="text-slate-700">
              <td className="px-4 py-4">
                <p className="font-semibold text-slate-950">{product.name}</p>
                <p className="text-slate-500">{product.description}</p>
              </td>
              <td className="px-4 py-4">{product.categoryName}</td>
              <td className="px-4 py-4">{formatMoney(product.price)}</td>
              <td className="px-4 py-4">
                {product.stockQuantity} / min {product.minStock}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    product.stockQuantity <= product.minStock
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {product.stockQuantity <= product.minStock
                    ? "Atenção"
                    : product.active
                      ? "Ativo"
                      : "Inativo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

