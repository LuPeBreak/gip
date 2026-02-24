export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    field?: string;
  };
  meta?: {
    warnings?: string[];
    [key: string]: unknown;
  };
}

export function createSuccessResponse<T>(
  data?: T,
  meta?: ActionResponse["meta"],
): ActionResponse<T> {
  return {
    success: true,
    data,
    meta,
  };
}

export function createErrorResponse(
  message: string,
  code?: string,
  field?: string,
): ActionResponse<never> {
  return {
    success: false,
    error: {
      message,
      code,
      field,
    },
  };
}
