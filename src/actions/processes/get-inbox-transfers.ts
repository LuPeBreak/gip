"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

export interface InboxTransferItem {
  id: string;
  processId: string;
  processNumber: string;
  processDescription: string;
  fromUserId: string;
  fromUserName: string;
  observation: string | null;
  createdAt: Date;
}

export const getInboxTransfers = withPermissions(
  [{ resource: "process", action: ["list"] }],
  async (session): Promise<ActionResponse<InboxTransferItem[]>> => {
    try {
      const processes = await prisma.process.findMany({
        where: {
          pendingTransferToUserId: session.user.id,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          pendingTransferCreatedAt: "desc",
        },
      });

      const result: InboxTransferItem[] = processes.map((p) => ({
        id: p.id,
        processId: p.id,
        processNumber: p.number,
        processDescription: p.description,
        fromUserId: p.owner?.id ?? "",
        fromUserName: p.owner?.name ?? "",
        observation: p.pendingTransferObservation,
        createdAt: p.pendingTransferCreatedAt as Date,
      }));

      return createSuccessResponse(result);
    } catch (error) {
      console.error("Erro ao buscar caixa de entrada:", error);
      return createErrorResponse("Erro interno ao buscar caixa de entrada.");
    }
  },
);
