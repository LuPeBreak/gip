import {
  Check,
  CheckCircle,
  ExternalLink,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Shield,
  X,
} from "lucide-react";
import type { ProcessEventEnum } from "@/lib/prisma/generated/enums";

export const PROCESS_EVENT_CONFIG: Record<
  ProcessEventEnum,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  CREATED: { label: "Processo criado", icon: Plus, color: "text-green-600" },
  TRANSFER_SENT: {
    label: "Transferência enviada",
    icon: Send,
    color: "text-blue-600",
  },
  TRANSFER_ACCEPTED: {
    label: "Transferência aceita",
    icon: Check,
    color: "text-green-600",
  },
  TRANSFER_REJECTED: {
    label: "Transferência recusada",
    icon: X,
    color: "text-red-600",
  },
  FINISHED: {
    label: "Processo finalizado",
    icon: CheckCircle,
    color: "text-gray-600",
  },
  REOPENED: {
    label: "Processo reaberto",
    icon: RotateCcw,
    color: "text-orange-600",
  },
  EXTERNAL_SENT: {
    label: "Enviado para externo",
    icon: ExternalLink,
    color: "text-purple-600",
  },
  EXTERNAL_RECOVERED: {
    label: "Recuperado de externo",
    icon: RotateCcw,
    color: "text-green-600",
  },
  ADMIN_TAKE_OVER: {
    label: "Tomada de posse (Admin)",
    icon: Shield,
    color: "text-amber-600",
  },
  ADMIN_FORCE_TRANSFER: {
    label: "Transferência forçada (Admin)",
    icon: Shield,
    color: "text-amber-600",
  },
  DATA_EDITED: {
    label: "Dados alterados",
    icon: Pencil,
    color: "text-slate-600",
  },
};
