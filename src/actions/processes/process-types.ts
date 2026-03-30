export type ProcessStatus = "OPEN" | "FINISHED";

export type ProcessBase = {
  id: string;
  number: string;
  description: string;
  status: ProcessStatus;
  ownerId: string | null;
  ownerName: string | null;
  ownerSectorName: string | null;
  createdAt: Date;
  updatedAt?: Date;
  pendingTransferToUserId?: string | null;
  pendingTransferToUserName?: string | null;
  pendingTransferObservation?: string | null;
  pendingTransferCreatedAt?: Date | null;
  location?: string | null;
};
