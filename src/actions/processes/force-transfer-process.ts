"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import {
  notifyForceTransfer,
  notifyProcessTransferredByAdmin,
  notifyTakeOver,
} from "@/lib/email/notifications";
import { prisma } from "@/lib/prisma";

const forceTransferSchema = z.object({
  processId: z.string().min(1, "ID do processo é obrigatório"),
  targetUserId: z.string().min(1, "Usuário destino é obrigatório"),
  reason: z.string().min(3, "O motivo deve ter pelo menos 3 caracteres"),
});

export const forceTransferProcess = withPermissions(
  [{ resource: "process", action: ["intervene"] }],
  async (
    session,
    data: z.infer<typeof forceTransferSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId, targetUserId, reason } =
        forceTransferSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.status === "FINISHED") {
        return createErrorResponse(
          "Não é possível transferir um processo finalizado. Reabra o processo primeiro.",
        );
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
      });

      if (!targetUser || targetUser.banned) {
        return createErrorResponse("Usuário destino inválido.");
      }

      if (process.ownerId === targetUserId) {
        return createErrorResponse("O processo já está com este usuário.");
      }

      const isTakeOver = targetUserId === session.user.id;

      await prisma.$transaction([
        prisma.process.update({
          where: { id: processId },
          data: {
            ownerId: targetUserId,
            status: "OPEN",
            pendingTransferToUserId: null,
            pendingTransferObservation: null,
            pendingTransferCreatedAt: null,
            location: null,
          },
        }),
        prisma.processEvent.create({
          data: {
            processId,
            type: isTakeOver ? "ADMIN_TAKE_OVER" : "ADMIN_FORCE_TRANSFER",
            actorId: session.user.id,
            fromUserId: process.ownerId,
            toUserId: targetUserId,
            observation: reason,
          },
        }),
      ]);

      try {
        const processInfo = {
          id: process.id,
          number: process.number,
          description: process.description,
        };

        if (isTakeOver) {
          if (process.ownerId) {
            const previousOwner = await prisma.user.findUnique({
              where: { id: process.ownerId },
            });
            if (previousOwner) {
              await notifyTakeOver(
                processInfo,
                session.user.name,
                previousOwner.email,
                previousOwner.name,
                reason,
              );
            }
          }
        } else {
          const previousOwner = process.ownerId
            ? await prisma.user.findUnique({
                where: { id: process.ownerId },
              })
            : null;

          await notifyForceTransfer(
            processInfo,
            session.user.name,
            targetUser.email,
            targetUser.name,
            previousOwner?.name ?? "Desconhecido",
            reason,
          );

          if (previousOwner) {
            await notifyProcessTransferredByAdmin(
              processInfo,
              targetUser.name,
              previousOwner.email,
              previousOwner.name,
              reason,
            );
          }
        }
      } catch (error) {
        console.error("Falha ao enviar email de transferência forçada:", error);
      }

      revalidatePath("/dashboard/processes");
      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro na transferência forçada:", error);
      return createErrorResponse(
        "Erro interno ao realizar transferência forçada.",
      );
    }
  },
);
