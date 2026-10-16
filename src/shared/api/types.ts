export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly code: string;
  readonly details: unknown;
  readonly status: number;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
    this.details = body.details ?? null;
  }
}

/** Paged list response of the API. */
export interface Paginated<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
}
