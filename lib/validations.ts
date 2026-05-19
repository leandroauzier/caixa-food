import { z } from "zod";

import { orderStatuses, paymentMethods, roles } from "@/types/domain";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail valido.").trim(),
  password: z
    .string()
    .min(8, "A senha precisa ter ao menos 8 caracteres.")
    .max(64, "A senha esta longa demais."),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatorio."),
  description: z.string().trim().max(120).optional().or(z.literal("")),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatorio."),
  description: z.string().trim().max(180).optional().or(z.literal("")),
  categoryId: z.string().trim().min(1, "Escolha uma categoria."),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  price: z.coerce.number().positive("Preco precisa ser maior que zero."),
  stockQuantity: z.coerce.number().int().min(0, "Estoque invalido."),
  minStock: z.coerce.number().int().min(0, "Minimo invalido."),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().trim().min(1),
  status: z.enum(orderStatuses),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Informe o nome do cliente."),
  type: z.enum(["BALCAO", "MESA", "DELIVERY", "RETIRADA"]),
  tableNumber: z.string().trim().max(10).optional().or(z.literal("")),
  notes: z.string().trim().max(160).optional().or(z.literal("")),
  cart: z.string().trim().min(2, "Adicione itens ao carrinho."),
});

export const paymentSchema = z.object({
  orderId: z.string().trim().min(1),
  amount: z.coerce.number().positive("Valor invalido."),
  method: z.enum(paymentMethods),
});

export const userProvisionSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().trim(),
  role: z.enum(roles),
});
