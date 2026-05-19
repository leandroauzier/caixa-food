import "server-only";

import nodemailer from "nodemailer";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\"":
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function getLoginUrl() {
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  return new URL("/login", baseUrl).toString();
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !user || !pass || !from) {
    throw new Error(
      "Configure SMTP_HOST, SMTP_USER, SMTP_PASS e SMTP_FROM para enviar e-mail.",
    );
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true";

  return {
    from,
    transporter: nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    }),
  };
}

export async function sendTemporaryPasswordEmail(input: {
  to: string;
  name: string;
  companyName: string;
  password: string;
}) {
  const { from, transporter } = getTransport();
  const loginUrl = getLoginUrl();
  const safeName = escapeHtml(input.name);
  const safeCompanyName = escapeHtml(input.companyName);
  const subject = `Seu acesso foi criado na ${input.companyName}`;
  const text = [
    `Olá, ${input.name}.`,
    "",
    `Seu acesso na ${input.companyName} foi criado com sucesso.`,
    `Senha temporária: ${input.password}`,
    `Acesse: ${loginUrl}`,
    "",
    "Troque essa senha assim que entrar pela primeira vez.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <p>Olá, ${safeName}.</p>
      <p>Seu acesso na <strong>${safeCompanyName}</strong> foi criado com sucesso.</p>
      <p><strong>Senha temporária:</strong> ${input.password}</p>
      <p><a href="${loginUrl}">Entrar no sistema</a></p>
      <p style="color: #475569;">Troque essa senha assim que entrar pela primeira vez.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: input.to,
    subject,
    text,
    html,
  });
}
