"use server";

import ExcelJS from "exceljs";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import { formatDateForExcel } from "@/lib/utils/date-formatters";
import {
  buildProcessWhereClause,
  type ProcessFilterParams,
} from "./process-filter-utils";

export type ExportProcessesParams = ProcessFilterParams;

export interface ExportResult {
  base64: string;
  filename: string;
}

export const exportProcesses = withPermissions(
  [{ resource: "report", action: ["export"] }],
  async (
    _session,
    params?: ExportProcessesParams,
  ): Promise<ActionResponse<ExportResult>> => {
    try {
      const where = buildProcessWhereClause(params);

      const processes = await prisma.process.findMany({
        where,
        include: {
          owner: {
            select: {
              name: true,
              sector: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Processos");

      worksheet.columns = [
        { header: "Número", key: "number", width: 20 },
        { header: "Descrição", key: "description", width: 40 },
        { header: "Status", key: "status", width: 15 },
        { header: "Localização", key: "location", width: 25 },
        { header: "Última Movimentação", key: "updatedAt", width: 22 },
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.height = 25;
      const colCount = worksheet.columns?.length ?? 0;

      for (let col = 1; col <= colCount; col++) {
        const cell = headerRow.getCell(col);
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1F4E79" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }

      for (const proc of processes) {
        const locationText = proc.location
          ? `Externo: ${proc.location}`
          : proc.owner
            ? (proc.owner.sector?.name ?? "Sem setor")
            : "Sem responsável";

        const statusText = proc.status === "OPEN" ? "Aberto" : "Finalizado";

        const row = worksheet.addRow({
          number: proc.number,
          description: proc.description,
          status: statusText,
          location: locationText,
          updatedAt: formatDateForExcel(proc.updatedAt),
        });

        const dateCell = row.getCell("updatedAt");
        dateCell.alignment = { horizontal: "center" };

        for (let col = 1; col <= colCount; col++) {
          const cell = row.getCell(col);
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      }

      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      const buffer = await workbook.xlsx.writeBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
      const filename = `processos-${dateStr}-${timeStr}.xlsx`;

      return createSuccessResponse({ base64, filename });
    } catch (error) {
      console.error("Erro ao exportar processos:", error);
      return createErrorResponse("Erro ao gerar relatório.");
    }
  },
);
