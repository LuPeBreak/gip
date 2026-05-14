"use client";

import { NotepadText } from "lucide-react";
import { useState } from "react";
import type { ProcessItem } from "@/actions/processes/get-processes";
import { EditObservationDialog } from "@/components/dashboard/processes/edit-observation-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import type { RoleKey } from "@/lib/auth/permissions";

interface ProcessDetailEditObservationButtonProps {
  process: ProcessItem;
}

export function ProcessDetailEditObservationButton({
  process,
}: ProcessDetailEditObservationButtonProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const userRole = (session?.user.role as RoleKey) ?? "user";

  const canEdit = authClient.admin.checkRolePermission({
    permissions: { process: ["update"] },
    role: userRole,
  });

  const canEditObservation = authClient.admin.checkRolePermission({
    permissions: { process: ["edit_observation"] },
    role: userRole,
  });

  const isOwner = session?.user.id === process.ownerId;

  if (canEdit) return null;
  if (!canEditObservation || !isOwner) return null;

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <NotepadText className="mr-2 h-4 w-4" />
        Editar Observação
      </Button>
      <EditObservationDialog
        process={process}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
