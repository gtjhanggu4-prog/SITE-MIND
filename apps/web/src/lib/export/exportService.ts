export type ExportFormat = "pdf" | "xlsx" | "docx" | "copy";

export interface ExportResult {
  ok: boolean;
  message: string;
  fileName: string;
  format: ExportFormat;
  payload: unknown;
}

function getFallbackExtension(format: ExportFormat) {
  if (format === "pdf" || format === "docx") return "md";
  if (format === "xlsx") return "json";
  return "txt";
}

export async function prepareExport(format: ExportFormat, fileName: string, payload: unknown, target: "report" | "contract" | "profit" | "crm"): Promise<ExportResult> {
  if (format === "copy") {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(typeof payload === "string" ? payload : JSON.stringify(payload, null, 2));
    }
    return { ok: true, message: "복사 완료", fileName, format, payload };
  }

  const bridge = typeof window !== "undefined" ? window.siteMind : undefined;
  const payloadText = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  const extension = getFallbackExtension(format);

  if (bridge?.saveFile) {
    const fullName = `${fileName}.${extension}`;
    if (target === "contract" && bridge.exportContract) {
      const result = await bridge.exportContract({ fileName: fullName, format, content: payloadText });
      return { ok: Boolean(result.ok), message: result.ok ? `${extension.toUpperCase()} 저장 완료` : result.message ?? "저장 취소", fileName, format, payload };
    }

    if (bridge.exportReport) {
      const result = await bridge.exportReport({ fileName: fullName, format, content: payloadText });
      return { ok: Boolean(result.ok), message: result.ok ? `${extension.toUpperCase()} 저장 완료` : result.message ?? "저장 취소", fileName, format, payload };
    }
  }

  return {
    ok: true,
    message: `${format.toUpperCase()} 출력 준비 데이터 생성 완료`,
    fileName,
    format,
    payload,
  };
}
