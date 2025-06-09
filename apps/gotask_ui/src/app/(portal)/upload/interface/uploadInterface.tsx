export interface UploadResponse {
  inserted: number;
  skipped: number;
  message: string;
  errors: string[];
}
