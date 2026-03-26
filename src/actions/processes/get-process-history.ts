"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import type { ProcessEventEnum } from "@/lib/prisma/generated/enums";

export type ProcessEventMetadata = {
  fields: { name: string; from: string; to: string }[];
} | null;

export type ProcessEventHistoryEntry = {
  id: string;
  type: ProcessEventEnum;
  actorName: string;
  actorSectorName: string | null;
  fromUserName: string | null;
  fromUserSectorName: string | null;
  toUserName: string | null;
  toUserSectorName: string | null;
  observation: string | null;
  metadata: ProcessEventMetadata;
  createdAt: Date;
};

export const getProcessHistory = withPermissions(
  [{ resource: "process", action: ["list"] }],
  async (
    _session,
    processId: string,
  ): Promise<ActionResponse<ProcessEventHistoryEntry[]>> => {
    try {
      const events = await prisma.processEvent.findMany({
        where: { processId },
        include: {
          actor: {
            select: {
              name: true,
              sector: { select: { name: true } },
            },
          },
          fromUser: {
            select: {
              name: true,
              sector: { select: { name: true } },
            },
          },
          toUser: {
            select: {
              name: true,
              sector: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const entries: ProcessEventHistoryEntry[] = events.map((event) => ({
        id: event.id,
        type: event.type,
        actorName: event.actor.name,
        actorSectorName: event.actor.sector?.name ?? null,
        fromUserName: event.fromUser?.name ?? null,
        fromUserSectorName: event.fromUser?.sector?.name ?? null,
        toUserName: event.toUser?.name ?? null,
        toUserSectorName: event.toUser?.sector?.name ?? null,
        observation: event.observation,
        metadata: event.metadata as ProcessEventMetadata,
        createdAt: event.createdAt,
      }));

      return createSuccessResponse(entries);
    } catch (error) {
      console.error("Erro ao buscar histórico do processo:", error);
      return createErrorResponse("Erro interno ao buscar histórico.");
    }
  },
);
