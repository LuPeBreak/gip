interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface TransferTemplateData {
  processNumber: string;
  processDescription: string;
  processId: string;
  actorName: string;
  recipientName: string;
  previousOwnerName?: string;
  newOwnerName?: string;
  observation?: string | null;
  reason?: string | null;
}

const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #1a56db; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; }
    .content { padding: 32px 24px; color: #333333; line-height: 1.6; }
    .content h2 { margin-top: 0; font-size: 18px; color: #1a1a1a; }
    .button { display: inline-block; background-color: #1a56db; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin: 16px 0; }
    .info-box { background-color: #f0f4ff; border-left: 4px solid #1a56db; padding: 12px 16px; margin: 16px 0; }
    .footer { background-color: #f4f4f7; padding: 16px 24px; text-align: center; font-size: 12px; color: #888888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GIP - Gestão Interna de Processos</h1>
    </div>
    <div class="content">
      ${body}
    </div>
    <div class="footer">
      <p>Sistema GIP - Prefeitura de Barra Mansa</p>
    </div>
  </div>
</body>
</html>`;
}

export function transferSentTemplate(
  data: TransferTemplateData,
): EmailTemplate {
  const link = `${baseUrl}/dashboard/inbox`;
  const subject = `[GIP] Processo #${data.processNumber} - Nova tramitação pendente`;

  const body = `
    <h2>Você recebeu uma tramitação pendente</h2>
    <p>Olá, ${data.recipientName}.</p>
    <p><strong>${data.actorName}</strong> enviou uma tramitação pendente para você.</p>
    <div class="info-box">
      <p><strong>Processo:</strong> ${data.processNumber}</p>
      <p><strong>Descrição:</strong> ${data.processDescription}</p>
      ${data.observation ? `<p><strong>Observação:</strong> ${data.observation}</p>` : ""}
    </div>
    <p>Acesse sua caixa de entrada para aceitar ou rejeitar a tramitação:</p>
    <a class="button" href="${link}">Abrir caixa de entrada</a>
  `;

  const text = `Você recebeu uma tramitação pendente

Olá, ${data.recipientName}.

${data.actorName} enviou uma tramitação pendente para você.

Processo: ${data.processNumber}
Descrição: ${data.processDescription}
${data.observation ? `Observação: ${data.observation}` : ""}

Acesse sua caixa de entrada para aceitar ou rejeitar a tramitação: ${link}`;

  return { subject, html: wrapHtml(subject, body), text };
}

export function transferRejectedTemplate(
  data: TransferTemplateData,
): EmailTemplate {
  const link = `${baseUrl}/dashboard/processes/${data.processId}`;
  const subject = `[GIP] Processo #${data.processNumber} - Tramitação rejeitada`;

  const body = `
    <h2>Sua tramitação foi rejeitada</h2>
    <p>Olá, ${data.recipientName}.</p>
    <p><strong>${data.actorName}</strong> rejeitou a tramitação do processo abaixo.</p>
    <div class="info-box">
      <p><strong>Processo:</strong> ${data.processNumber}</p>
      <p><strong>Descrição:</strong> ${data.processDescription}</p>
      <p><strong>Motivo:</strong> ${data.reason}</p>
    </div>
    <p>O processo permanece sob sua responsabilidade.</p>
    <p>Acesse o processo para mais detalhes:</p>
    <a class="button" href="${link}">Ver processo</a>
  `;

  const text = `Sua tramitação foi rejeitada

Olá, ${data.recipientName}.

${data.actorName} rejeitou a tramitação do processo abaixo.

Processo: ${data.processNumber}
Descrição: ${data.processDescription}
Motivo: ${data.reason}

O processo permanece sob sua responsabilidade.

Acesse o processo para mais detalhes: ${link}`;

  return { subject, html: wrapHtml(subject, body), text };
}

export function forceTransferTemplate(
  data: TransferTemplateData,
): EmailTemplate {
  const link = `${baseUrl}/dashboard/processes/${data.processId}`;
  const subject = `[GIP] Processo #${data.processNumber} - Transferência administrativa`;

  const body = `
    <h2>Processo transferido para você por administração</h2>
    <p>Olá, ${data.recipientName}.</p>
    <p>O administrador <strong>${data.actorName}</strong> transferiu o processo abaixo para sua posse.</p>
    <div class="info-box">
      <p><strong>Processo:</strong> ${data.processNumber}</p>
      <p><strong>Descrição:</strong> ${data.processDescription}</p>
      ${data.previousOwnerName ? `<p><strong>Anteriormente com:</strong> ${data.previousOwnerName}</p>` : ""}
      <p><strong>Motivo:</strong> ${data.reason}</p>
    </div>
    <p>Esta transferência foi realizada por intervenção administrativa e não requer aceitação.</p>
    <a class="button" href="${link}">Ver processo</a>
  `;

  const text = `Processo transferido para você por administração

Olá, ${data.recipientName}.

O administrador ${data.actorName} transferiu o processo abaixo para sua posse.

Processo: ${data.processNumber}
Descrição: ${data.processDescription}
${data.previousOwnerName ? `Anteriormente com: ${data.previousOwnerName}` : ""}
Motivo: ${data.reason}

Esta transferência foi realizada por intervenção administrativa e não requer aceitação.

Acesse: ${link}`;

  return { subject, html: wrapHtml(subject, body), text };
}

export function processTransferredByAdminTemplate(
  data: TransferTemplateData,
): EmailTemplate {
  const link = `${baseUrl}/dashboard/processes/${data.processId}`;
  const subject = `[GIP] Processo #${data.processNumber} - Processo transferido por administração`;

  const body = `
    <h2>Seu processo foi transferido por administração</h2>
    <p>Olá, ${data.recipientName}.</p>
    <p>O processo abaixo foi transferido para <strong>${data.newOwnerName}</strong> por intervenção administrativa.</p>
    <div class="info-box">
      <p><strong>Processo:</strong> ${data.processNumber}</p>
      <p><strong>Descrição:</strong> ${data.processDescription}</p>
      <p><strong>Transferido para:</strong> ${data.newOwnerName}</p>
      <p><strong>Motivo:</strong> ${data.reason}</p>
    </div>
    <p>O processo não está mais sob sua responsabilidade.</p>
    <a class="button" href="${link}">Ver processo</a>
  `;

  const text = `Seu processo foi transferido por administração

Olá, ${data.recipientName}.

O processo abaixo foi transferido para ${data.newOwnerName} por intervenção administrativa.

Processo: ${data.processNumber}
Descrição: ${data.processDescription}
Transferido para: ${data.newOwnerName}
Motivo: ${data.reason}

O processo não está mais sob sua responsabilidade.

Acesse: ${link}`;

  return { subject, html: wrapHtml(subject, body), text };
}

export function takeOverNotificationTemplate(
  data: TransferTemplateData,
): EmailTemplate {
  const link = `${baseUrl}/dashboard/processes/${data.processId}`;
  const subject = `[GIP] Processo #${data.processNumber} - Processo assumido por administração`;

  const body = `
    <h2>Seu processo foi assumido por um administrador</h2>
    <p>Olá, ${data.recipientName}.</p>
    <p>O administrador <strong>${data.actorName}</strong> assumiu a responsabilidade do processo abaixo.</p>
    <div class="info-box">
      <p><strong>Processo:</strong> ${data.processNumber}</p>
      <p><strong>Descrição:</strong> ${data.processDescription}</p>
      <p><strong>Motivo:</strong> ${data.reason}</p>
    </div>
    <p>O processo não está mais sob sua responsabilidade.</p>
    <a class="button" href="${link}">Ver processo</a>
  `;

  const text = `Seu processo foi assumido por um administrador

Olá, ${data.recipientName}.

O administrador ${data.actorName} assumiu a responsabilidade do processo abaixo.

Processo: ${data.processNumber}
Descrição: ${data.processDescription}
Motivo: ${data.reason}

O processo não está mais sob sua responsabilidade.

Acesse: ${link}`;

  return { subject, html: wrapHtml(subject, body), text };
}
