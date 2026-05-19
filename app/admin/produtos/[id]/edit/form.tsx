"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import {
  updateProductAction,
  type UpdateProductState,
} from "@/app/admin/produtos/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import type { CategorySummary, ProductSummary } from "@/types/domain";

const initialState: UpdateProductState = {};
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export function EditProductForm({
  product,
  categories,
}: {
  product: ProductSummary;
  categories: CategorySummary[];
}) {
  const [state, formAction] = useActionState(updateProductAction, initialState);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [previewUrl, setPreviewUrl] = useState(product.imageUrl);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageUrl(product.imageUrl);
      setPreviewUrl(product.imageUrl);
      setImageError("");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageUrl(product.imageUrl);
      setPreviewUrl(product.imageUrl);
      setImageError("A imagem precisa ter no maximo 4 MB.");
      event.target.value = "";
      return;
    }

    setImageError("");

    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      setImageUrl(value);
      setPreviewUrl(value);
    };
    reader.readAsDataURL(file);
  }

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={product.id} />

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Nome
        <input
          name="name"
          defaultValue={product.name}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
        {state.errors?.name ? (
          <span className="text-xs text-rose-700">{state.errors.name[0]}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Categoria
        <select
          name="categoryId"
          defaultValue={product.categoryId}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-950"
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {state.errors?.categoryId ? (
          <span className="text-xs text-rose-700">
            {state.errors.categoryId[0]}
          </span>
        ) : null}
      </label>

      <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
        Descrição
        <textarea
          name="description"
          rows={3}
          defaultValue={product.description}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          placeholder="Resumo rápido para PDV e cardápio."
        />
        {state.errors?.description ? (
          <span className="text-xs text-rose-700">
            {state.errors.description[0]}
          </span>
        ) : null}
      </label>

      <div className="md:col-span-2 grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                Sem imagem
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Imagem do produto</span>
          <input
            ref={fileInputRef}
            name="productImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex w-fit items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Selecionar imagem
          </button>
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <span className="text-xs font-normal text-slate-500">
            Se nenhum arquivo for selecionado, a imagem atual será mantida. Tamanho
            maximo: 4 MB.
          </span>
          {imageError ? (
            <span className="text-xs text-rose-700">{imageError}</span>
          ) : null}
        </div>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Preço
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={product.price}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
        {state.errors?.price ? (
          <span className="text-xs text-rose-700">{state.errors.price[0]}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Estoque atual
        <input
          name="stockQuantity"
          type="number"
          min="0"
          step="1"
          defaultValue={product.stockQuantity}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
        {state.errors?.stockQuantity ? (
          <span className="text-xs text-rose-700">
            {state.errors.stockQuantity[0]}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Estoque mínimo
        <input
          name="minStock"
          type="number"
          min="0"
          step="1"
          defaultValue={product.minStock}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
        {state.errors?.minStock ? (
          <span className="text-xs text-rose-700">
            {state.errors.minStock[0]}
          </span>
        ) : null}
      </label>

      <div className="md:col-span-2 flex flex-col gap-3">
        {state.message ? (
          <p
            aria-live="polite"
            className={`text-sm ${state.success ? "text-emerald-700" : "text-amber-700"}`}
          >
            {state.message}
          </p>
        ) : null}
        <div className="flex justify-end">
          <SubmitButton label="Salvar alterações" />
        </div>
      </div>
    </form>
  );
}
