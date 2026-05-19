"use client";

import { useActionState, useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import {
  createProductAction,
  type ProductFormState,
} from "@/app/admin/produtos/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import type { CategorySummary } from "@/types/domain";

const initialState: ProductFormState = {};

export function ProductQuickForm({
  categories,
}: {
  categories: CategorySummary[];
}) {
  const [state, formAction] = useActionState(createProductAction, initialState);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      setImageUrl("");
      setPreviewUrl("");
      return;
    }

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
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Nome
        <input
          name="name"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          placeholder="Ex.: Smash duplo trufado"
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
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-950"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Selecione
          </option>
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
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          placeholder="Resumo rápido para PDV e cardápio."
        />
      </label>

      <div className="md:col-span-2 grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Preview do produto"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                Sem imagem
              </span>
            )}
          </div>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Imagem do produto
          <input
            name="productImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white focus:border-slate-950"
          />
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <span className="text-xs text-slate-500">
            A imagem fica vinculada ao produto e aparece nas listagens do sistema.
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Preço
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
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
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Estoque mínimo
        <input
          name="minStock"
          type="number"
          min="0"
          step="1"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
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
          <SubmitButton label="Salvar produto" />
        </div>
      </div>
    </form>
  );
}
