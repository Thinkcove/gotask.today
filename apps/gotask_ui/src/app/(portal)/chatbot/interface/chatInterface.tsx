// // frontend/app/models/filemodel.ts
// export interface QueryResponse {
//   id: string;
//   _id: string;
//   message: string;
//   timestamp: string;
//   response?: string;
//   isUser: boolean;
//   isSystem?: boolean;
// }

// export interface HistoryEntry {
//   _id: string;
//   query: string;
//   timestamp: string;
//   response?: string;
//   conversationId?: string;
// }

// export interface UploadResponse {
//   inserted: number;
//   skipped: number;
//   errors: string[];
// }

export interface QueryHistoryEntry {
  _id: null | undefined;
  id: string;
  query: string;
  response: string;
  timestamp: string;
  conversationId: string;
}

export interface QueryResponse {
  id: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  isSystem?: boolean;
}

export interface UploadResponse {
  inserted: number;
  skipped: number;
  errors: string[];
}
