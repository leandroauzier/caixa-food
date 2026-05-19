import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import { getCategorySummaries, getProductById } from "@/features/catalog/dal";
import { requirePermission } from "@/lib/auth";
import { EditProductForm } from "./form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const user = await requirePermission("manageCatalog");
  const [categories, product] = await Promise.all([
    getCategorySummaries(),
    getProductById(user.companyId, id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AppShell
      user={user}
      currentPath="/admin/produtos"
      title={`Editar: ${product.name}`}
      description="Atualize dados do produto, imagem, categoria e estoque."
    >
      <BackLink href="/admin/produtos" />
      <SectionCard
        title="Dados do produto"
        description="A edição reaproveita a mesma validação do cadastro e mantém a imagem atual se nada novo for enviado."
      >
        <EditProductForm product={product} categories={categories} />
      </SectionCard>
    </AppShell>
  );
}
