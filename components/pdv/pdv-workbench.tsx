"use client";

import { useActionState, useEffect, useMemo, useState } from "react";

import { createOrderAction, type OrderFormState } from "@/app/pdv/actions";
import { ProductImage } from "@/components/ui/product-image";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatMoney } from "@/lib/money";
import type {
  CategorySummary,
  ProductOptionSummary,
  ProductSummary,
} from "@/types/domain";

type DraftCartItem = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  basePrice: number;
  notes: string;
  selectedOptions: ProductOptionSummary[];
};

const initialState: OrderFormState = {};

function buildCartId() {
  return `cart_${Math.random().toString(36).slice(2, 10)}`;
}

function itemUnitPrice(item: DraftCartItem) {
  return (
    item.basePrice +
    item.selectedOptions.reduce((sum, option) => sum + option.price, 0)
  );
}

function itemSubtotal(item: DraftCartItem) {
  return itemUnitPrice(item) * item.quantity;
}

export function PdvWorkbench({
  categories,
  products,
}: {
  categories: CategorySummary[];
  products: ProductSummary[];
}) {
  const [state, formAction] = useActionState(createOrderAction, initialState);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id ?? "",
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedNotes, setSelectedNotes] = useState("");
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [cart, setCart] = useState<DraftCartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState<
    "BALCAO" | "MESA" | "DELIVERY" | "RETIRADA"
  >("BALCAO");
  const [tableNumber, setTableNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null,
  );

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? products[0];

  const filteredProducts =
    activeCategoryId === "all"
      ? products
      : products.filter((product) => product.categoryId === activeCategoryId);

  const activeOptionPrice = useMemo(
    () =>
      selectedProduct
        ? selectedProduct.options
            .filter((option) => selectedOptionIds.includes(option.id))
            .reduce((sum, option) => sum + option.price, 0)
        : 0,
    [selectedOptionIds, selectedProduct],
  );

  const configuredItemTotal =
    ((selectedProduct?.price ?? 0) + activeOptionPrice) * selectedQuantity;
  const cartTotal = cart.reduce((sum, item) => sum + itemSubtotal(item), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  function toggleOption(optionId: string) {
    setSelectedOptionIds((current) =>
      current.includes(optionId)
        ? current.filter((item) => item !== optionId)
        : [...current, optionId],
    );
  }

  function resetCustomizerState() {
    setSelectedQuantity(1);
    setSelectedNotes("");
    setSelectedOptionIds([]);
  }

  function openCustomizer(product: ProductSummary) {
    setSelectedProductId(product.id);
    resetCustomizerState();
    setIsCustomizerOpen(true);
  }

  function closeCustomizer() {
    setIsCustomizerOpen(false);
    resetCustomizerState();
  }

  function addQuickItem(product: ProductSummary) {
    setCart((current) => [
      ...current,
      {
        id: buildCartId(),
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        quantity: 1,
        basePrice: product.price,
        notes: "",
        selectedOptions: [],
      },
    ]);
  }

  function addConfiguredItem() {
    const selectedOptions = selectedProduct.options.filter((option) =>
      selectedOptionIds.includes(option.id),
    );

    setCart((current) => [
      ...current,
      {
        id: buildCartId(),
        productId: selectedProduct.id,
        name: selectedProduct.name,
        imageUrl: selectedProduct.imageUrl,
        quantity: selectedQuantity,
        basePrice: selectedProduct.price,
        notes: selectedNotes,
        selectedOptions,
      },
    ]);

    closeCustomizer();
  }

  function updateCartQuantity(itemId: string, nextQuantity: number) {
    if (nextQuantity <= 0) {
      setCart((current) => current.filter((item) => item.id !== itemId));
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  }

  function clearDraftOrder() {
    setCart([]);
    setCustomerName("");
    setOrderType("BALCAO");
    setTableNumber("");
    setOrderNotes("");
    resetCustomizerState();
    setIsCartExpanded(false);
    setIsCustomizerOpen(false);
  }

  const cartPayload = JSON.stringify(
    cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      notes: item.notes,
      optionIds: item.selectedOptions.map((option) => option.id),
    })),
  );

  const mobileCartContentClass = isCartExpanded
    ? "mt-3 flex min-h-0 flex-1 flex-col"
    : "hidden";

  useEffect(() => {
    if (!state.success || !state.message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCart([]);
      setCustomerName("");
      setOrderType("BALCAO");
      setTableNumber("");
      setOrderNotes("");
      setSelectedQuantity(1);
      setSelectedNotes("");
      setSelectedOptionIds([]);
      setIsCartExpanded(false);
      setIsCustomizerOpen(false);
      setConfirmationMessage(state.message ?? null);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [state.message, state.success]);

  if (!selectedProduct) {
    return null;
  }

  return (
    <>
      {isCartExpanded ? (
        <button
          type="button"
          aria-label="Fechar carrinho"
          className="fixed inset-0 z-30 bg-slate-950/35 xl:hidden"
          onClick={() => setIsCartExpanded(false)}
        />
      ) : null}

      {isCustomizerOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdv-customizer-title"
        >
          <button
            type="button"
            aria-label="Fechar personalizacao"
            className="absolute inset-0"
            onClick={closeCustomizer}
          />

          <div className="relative z-10 flex max-h-[100svh] w-full max-w-2xl flex-col overflow-hidden rounded-[20px] border border-white/70 bg-white shadow-2xl sm:max-h-[calc(100svh-2rem)] sm:rounded-[24px]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Personalizacao do item
                </p>
                <h3
                  id="pdv-customizer-title"
                  className="mt-1 font-heading text-2xl text-slate-950"
                >
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeCustomizer}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-950 hover:text-slate-950"
              >
                Fechar
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
                <ProductImage
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="h-40 sm:h-44"
                  priority
                />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-heading text-2xl text-slate-950">
                      {formatMoney(selectedProduct.price)}
                    </p>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      {selectedProduct.categoryName}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                    {selectedProduct.description}
                  </p>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[120px_minmax(0,1fr)]">
                    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700 sm:text-sm">
                      Quantidade
                      <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedQuantity((value) => Math.max(1, value - 1))
                          }
                          className="h-8 w-8 rounded-full bg-white text-base font-semibold text-slate-700 shadow-sm"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-slate-950">
                          {selectedQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedQuantity((value) => value + 1)}
                          className="h-8 w-8 rounded-full bg-slate-950 text-base font-semibold text-white"
                        >
                          +
                        </button>
                      </div>
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700 sm:text-sm">
                      Observacoes do item
                      <textarea
                        value={selectedNotes}
                        onChange={(event) => setSelectedNotes(event.target.value)}
                        rows={2}
                        className="rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-950"
                        placeholder="Sem cebola, molho separado..."
                      />
                    </label>
                  </div>

                  {selectedProduct.options.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-800 sm:text-sm">
                        Extras e porcoes
                      </p>
                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        {selectedProduct.options.map((option) => {
                          const active = selectedOptionIds.includes(option.id);

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleOption(option.id)}
                              className={`rounded-[16px] border px-3 py-2.5 text-left text-xs transition sm:text-sm ${
                                active
                                  ? "border-sky-300 bg-sky-100 text-sky-900"
                                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                              }`}
                            >
                              <p className="font-semibold">{option.name}</p>
                              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] opacity-70">
                                {option.kind === "PORTION" ? "Porcao" : "Extra"} /{" "}
                                {formatMoney(option.price)}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-slate-50 p-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Total do item
                  </p>
                  <p className="mt-1 font-heading text-2xl text-slate-950">
                    {formatMoney(configuredItemTotal)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={closeCustomizer}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-950 hover:text-slate-950 sm:text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={addConfiguredItem}
                    className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-600 sm:text-sm"
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {confirmationMessage ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-3"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdv-confirmation-title"
        >
          <button
            type="button"
            aria-label="Fechar confirmacao"
            className="absolute inset-0"
            onClick={() => setConfirmationMessage(null)}
          />

          <div className="relative z-10 w-full max-w-md rounded-[22px] border border-white/70 bg-white p-5 text-slate-950 shadow-2xl">
            <p className="text-[11px] uppercase tracking-[0.26em] text-emerald-600">
              Pedido enviado
            </p>
            <h3
              id="pdv-confirmation-title"
              className="mt-2 font-heading text-2xl"
            >
              Tudo certo
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {confirmationMessage}
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setConfirmationMessage(null)}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid items-start gap-4 pb-24 xl:grid-cols-[minmax(0,1fr)_360px] xl:pb-0">
        <div className="space-y-4 xl:pr-1">
          <section className="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Catalogo rapido
                </p>
                <h2 className="mt-2 font-heading text-2xl text-slate-950 sm:text-3xl">
                  Monte o pedido sem atrito
                </h2>
                <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                  Escolha rapido, personalize so quando precisar e monte varios
                  itens na sequencia.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategoryId("all")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    activeCategoryId === "all"
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Todos
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategoryId(category.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      activeCategoryId === category.id
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 2xl:grid-cols-2">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className={`overflow-hidden rounded-[20px] border transition ${
                    selectedProductId === product.id
                      ? "border-sky-300 bg-sky-50/70 shadow-lg"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="grid gap-3 p-3 sm:grid-cols-[120px_minmax(0,1fr)]">
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-24 sm:h-28"
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                            {product.categoryName}
                          </p>
                          <h3 className="mt-1 font-heading text-xl text-slate-950">
                            {product.name}
                          </h3>
                        </div>
                        <p className="shrink-0 font-heading text-xl text-slate-950">
                          {formatMoney(product.price)}
                        </p>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">
                        {product.description}
                      </p>

                      {product.options.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {product.options.slice(0, 3).map((option) => (
                            <span
                              key={option.id}
                              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                option.kind === "PORTION"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-sky-100 text-sky-800"
                              }`}
                            >
                              {option.kind === "PORTION" ? "Porcao" : "Extra"}{" "}
                              {option.name}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openCustomizer(product)}
                          className="inline-flex min-w-0 items-center justify-center rounded-full border border-slate-300 px-2 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-950 hover:text-slate-950 sm:text-sm"
                        >
                          Personalizar
                        </button>
                        <button
                          type="button"
                          onClick={() => addQuickItem(product)}
                          className="inline-flex min-w-0 items-center justify-center rounded-full bg-slate-950 px-2 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 sm:text-sm"
                        >
                          Adicionar rapido
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <form
          action={formAction}
          className={`border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] text-white shadow-2xl ${
            isCartExpanded
              ? "fixed inset-0 z-40 flex flex-col overflow-hidden rounded-none p-3 sm:inset-x-2 sm:top-2 sm:bottom-2 sm:rounded-[24px] sm:p-4"
              : "fixed inset-x-0 bottom-0 z-30 rounded-t-[20px] border-x-0 border-b-0 p-3"
          } xl:sticky xl:top-3 xl:inset-auto xl:bottom-auto xl:z-auto xl:flex xl:max-h-[calc(100svh-1.5rem)] xl:flex-col xl:overflow-hidden xl:rounded-[24px] xl:p-4`}
        >
          <input type="hidden" name="cart" value={cartPayload} />

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                Pedido em montagem
              </p>
              <h2 className="mt-1 font-heading text-2xl">Carrinho</h2>
            </div>

            <div className="flex items-center gap-2">
              <p className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200 sm:text-xs">
                {totalItems} item(ns)
              </p>
              <button
                type="button"
                onClick={() => setIsCartExpanded((value) => !value)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white xl:hidden"
              >
                {isCartExpanded ? "Fechar" : "Abrir"}
              </button>
            </div>
          </div>

          {!isCartExpanded ? (
            <div className="mt-3 flex items-center justify-between gap-3 xl:hidden">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Total
                </p>
                <p className="mt-1 font-heading text-2xl text-white">
                  {formatMoney(cartTotal)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartExpanded(true)}
                className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white"
              >
                Abrir pedido
              </button>
            </div>
          ) : null}

          <div
            className={`${mobileCartContentClass} xl:mt-3 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col`}
          >
            <div className="grid gap-3">
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                Cliente
                <input
                  name="customerName"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/40"
                  placeholder="Mesa 08, Paula, Retirada Joao..."
                  required
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                  Tipo
                  <select
                    name="type"
                    value={orderType}
                    onChange={(event) =>
                      setOrderType(
                        event.target.value as
                          | "BALCAO"
                          | "MESA"
                          | "DELIVERY"
                          | "RETIRADA",
                      )
                    }
                    className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/40 [color-scheme:dark]"
                  >
                    <option value="BALCAO">Balcao</option>
                    <option value="MESA">Mesa</option>
                    <option value="DELIVERY">Delivery</option>
                    <option value="RETIRADA">Retirada</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                  Mesa
                  <input
                    name="tableNumber"
                    value={tableNumber}
                    onChange={(event) => setTableNumber(event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/40"
                    placeholder="Opcional"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                Observacoes gerais
                <textarea
                  name="notes"
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  rows={2}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/40"
                  placeholder="Entrega lateral, enviar guardanapos..."
                />
              </label>
            </div>

            <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-white/15 bg-white/5 p-4 text-xs text-slate-400 sm:text-sm">
                  Nenhum item no carrinho ainda. Escolha um produto e va
                  adicionando com ou sem personalizacao.
                </div>
              ) : null}

              {cart.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[16px] border border-white/10 bg-white/5 px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.quantity}x {item.name}
                      </p>
                      {item.selectedOptions.length > 0 ? (
                        <p className="mt-1 text-[11px] text-slate-300 sm:text-xs">
                          {item.selectedOptions
                            .map(
                              (option) =>
                                `${option.kind === "PORTION" ? "Porcao" : "Extra"} ${option.name}`,
                            )
                            .join(" / ")}
                        </p>
                      ) : null}
                      {item.notes ? (
                        <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                          {item.notes}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatMoney(itemSubtotal(item))}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setCart((current) =>
                            current.filter((entry) => entry.id !== item.id),
                          )
                        }
                        className="mt-1 text-[11px] font-semibold text-rose-200"
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 rounded-full bg-white/10 text-sm font-semibold text-white"
                      >
                        -
                      </button>
                      <span className="min-w-7 text-center text-xs font-semibold text-white sm:text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 rounded-full bg-white text-sm font-semibold text-slate-950"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 sm:text-xs">
                      Unit. {formatMoney(itemUnitPrice(item))}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {state.message && !state.success ? (
              <p
                aria-live="polite"
                className={`mt-3 text-xs sm:text-sm ${
                  state.success ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                {state.message}
              </p>
            ) : null}

            <div className="mt-3 rounded-[18px] border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">
                    Total do pedido
                  </p>
                  <p className="mt-1 font-heading text-3xl text-white">
                    {formatMoney(cartTotal)}
                  </p>
                </div>
                <div className="rounded-[16px] bg-emerald-400/12 px-3 py-2 text-right">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">
                    Itens
                  </p>
                  <p className="mt-1 font-heading text-xl text-emerald-100">
                    {totalItems}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={clearDraftOrder}
                  className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-white/35 hover:text-white sm:text-sm"
                >
                  Limpar
                </button>
                <SubmitButton label="Enviar para cozinha" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
