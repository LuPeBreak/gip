import { getProcessHistory } from "@/actions/processes/get-process-history";
import { formatDateMedium } from "@/lib/utils/date-formatters";
import { PROCESS_EVENT_CONFIG } from "./process-event-constants";

interface ProcessHistoryTimelineProps {
  processId: string;
}

function getEventDescription(
  type: string,
  _actorName: string,
  fromUserName: string | null,
  toUserName: string | null,
) {
  switch (type) {
    case "CREATED":
      return { title: "Processo criado", subtitle: "" };
    case "TRANSFER_SENT":
      return {
        title: "Transferência enviada",
        subtitle: `${fromUserName ?? "—"} → ${toUserName ?? "—"}`,
        showObservation: true,
      };
    case "TRANSFER_ACCEPTED":
      return {
        title: "Transferência aceita",
        subtitle: `${fromUserName ?? "—"} → ${toUserName ?? "—"}`,
      };
    case "TRANSFER_REJECTED":
      return {
        title: "Transferência recusada",
        subtitle: `${fromUserName ?? "—"} → ${toUserName ?? "—"}`,
        showObservation: true,
      };
    case "FINISHED":
      return { title: "Processo finalizado", subtitle: "" };
    case "REOPENED":
      return { title: "Processo reaberto", subtitle: "" };
    case "EXTERNAL_SENT":
      return {
        title: "Enviado para externo",
        subtitle: "",
        showObservation: true,
      };
    case "EXTERNAL_RECOVERED":
      return { title: "Recuperado de externo", subtitle: "" };
    case "ADMIN_TAKE_OVER":
      return {
        title: "Tomada de posse",
        subtitle: fromUserName
          ? `${fromUserName} → ${toUserName ?? "—"}`
          : toUserName
            ? `→ ${toUserName}`
            : "",
        showObservation: true,
      };
    case "ADMIN_FORCE_TRANSFER":
      return {
        title: "Transferência forçada",
        subtitle: `${fromUserName ?? "—"} → ${toUserName ?? "—"}`,
        showObservation: true,
      };
    case "DATA_EDITED":
      return { title: "Dados alterados", subtitle: "" };
    default:
      return { title: "Evento desconhecido", subtitle: "" };
  }
}

function DiffsRenderer({
  metadata,
}: {
  metadata: { fields: { name: string; from: string; to: string }[] } | null;
}) {
  if (!metadata?.fields?.length) return null;

  const fieldLabels: Record<string, string> = {
    number: "Número",
    description: "Descrição",
    externalOrigin: "Origem Externa",
  };

  return (
    <div className="mt-2 space-y-1 rounded-md border bg-muted/30 p-2 text-xs">
      {metadata.fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-0.5">
          <span className="font-medium text-muted-foreground uppercase text-[10px]">
            {fieldLabels[field.name] ?? field.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="line-through opacity-60">
              {field.from || "(vazio)"}
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="font-medium">{field.to || "(vazio)"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventIcon({
  type,
  config,
}: {
  type: string;
  config: (typeof PROCESS_EVENT_CONFIG)[keyof typeof PROCESS_EVENT_CONFIG];
}) {
  const Icon = config.icon;

  const bgColors: Record<string, string> = {
    CREATED:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    TRANSFER_SENT:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    TRANSFER_ACCEPTED:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    TRANSFER_REJECTED:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    FINISHED:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    REOPENED:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    EXTERNAL_SENT:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    EXTERNAL_RECOVERED:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    ADMIN_TAKE_OVER:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    ADMIN_FORCE_TRANSFER:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    DATA_EDITED:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bgColors[type] || "bg-muted text-muted-foreground"}`}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}

export async function ProcessHistoryTimeline({
  processId,
}: ProcessHistoryTimelineProps) {
  const response = await getProcessHistory(processId);

  if (!response.success) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-center text-sm text-destructive">
        Erro ao carregar histórico.
      </div>
    );
  }

  const events = response.data ?? [];

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
          <svg
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Nenhum evento registrado
        </p>
        <p className="text-xs text-muted-foreground">
          As ações realizadas aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      {events.map((event, index) => {
        const config = PROCESS_EVENT_CONFIG[event.type];
        const desc = getEventDescription(
          event.type,
          event.actorName,
          event.fromUserName,
          event.toUserName,
        );
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative flex gap-3">
            {!isLast && (
              <div className="absolute left-[14px] top-10 bottom-[-12px] w-0.5 bg-border" />
            )}

            <div className="relative z-10 pt-0.5">
              <EventIcon type={event.type} config={config} />
            </div>

            <div className="min-w-0 flex-1 rounded-lg border bg-card p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm">{desc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {desc.subtitle}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatDateMedium(event.createdAt)}
                </span>
              </div>

              {desc.showObservation && event.observation && (
                <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                  <span className="font-medium text-muted-foreground">
                    {event.type === "TRANSFER_REJECTED" ||
                    event.type.startsWith("ADMIN_")
                      ? "Motivo: "
                      : event.type === "EXTERNAL_SENT"
                        ? "Localização: "
                        : "Observação: "}
                  </span>
                  <span>{event.observation}</span>
                </div>
              )}

              {event.type === "DATA_EDITED" && (
                <DiffsRenderer metadata={event.metadata} />
              )}

              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="font-medium">{event.actorName}</span>
                {event.actorSectorName && (
                  <>
                    <span>·</span>
                    <span>{event.actorSectorName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
