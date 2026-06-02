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

      const now = new Date();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Processos");

      worksheet.columns = [
        { header: "Número", key: "number", width: 20 },
        { header: "Descrição", key: "description", width: 60 },
        { header: "Status", key: "status", width: 15 },
        { header: "Localização", key: "location", width: 25 },
        { header: "Origem", key: "externalOrigin", width: 30 },
        { header: "Observação", key: "observation", width: 35 },
        { header: "Última Movimentação", key: "updatedAt", width: 30 },
      ];

      const colCount = worksheet.columns?.length ?? 0;

      const dateTitle = `Relatório gerado em: ${formatDateForExcel(now)}`;
      worksheet.insertRow(1, [dateTitle]);
      worksheet.mergeCells(1, 1, 1, colCount);
      const titleRow = worksheet.getRow(1);
      titleRow.getCell(1).font = { bold: true, size: 16 };
      titleRow.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      titleRow.height = 30;

      const headerRow = worksheet.getRow(2);
      headerRow.height = 35;

      for (let col = 1; col <= colCount; col++) {
        const cell = headerRow.getCell(col);
        cell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
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
          externalOrigin: proc.externalOrigin ?? "",
          observation: proc.observation ?? "",
          updatedAt: formatDateForExcel(proc.updatedAt),
        });

        const dateCell = row.getCell("updatedAt");
        dateCell.alignment = { horizontal: "center" };

        row.height = 25;

        for (let col = 1; col <= colCount; col++) {
          const cell = row.getCell(col);
          cell.font = { size: 16 };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      }

      worksheet.views = [{ state: "frozen", ySplit: 2 }];

      const buffer = await workbook.xlsx.writeBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

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
