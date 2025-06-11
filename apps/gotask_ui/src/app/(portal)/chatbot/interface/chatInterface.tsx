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
