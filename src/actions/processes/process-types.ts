export type ProcessStatus = "OPEN" | "FINISHED" | "EXTERNAL";

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
};

export function formatProcessOwner(
  ownerName: string | null,
  ownerSectorName: string | null,
): { name: string; sector: string } | null {
  if (!ownerName) return null;
  return {
    name: ownerName,
    sector: ownerSectorName ?? "Sem setor",
  };
}
