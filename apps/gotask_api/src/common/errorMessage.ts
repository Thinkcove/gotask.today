interface ErrorMessage {
  message: string;
  details?: any;
}

class ErrorMessages {
  private errorMessagesMap: Map<number, ErrorMessage>;

  constructor(data: { status: number; message: string }[] = []) {
    this.errorMessagesMap = new Map(
      data
        .filter((item) => item && item.status && item.message)
        .map((item) => [item.status, { message: item.message }] as [number, ErrorMessage])
    );
  }

  getErrorMessage(status: number): ErrorMessage | undefined {
    return this.errorMessagesMap.get(status);
  }

  addErrorMessage(status: number, message: string, details?: any): void {
    if (this.getErrorMessage(status) === undefined) {
      const errorData: ErrorMessage = { message };
      if (details) {
        errorData.details = details;
      }
      this.errorMessagesMap.set(status, errorData);
    }
  }
}

export default ErrorMessages;
