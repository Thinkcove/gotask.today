export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateUpdateHistory<T>(oldData: T, newData: Partial<T>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in newData) {
    const typedKey = key as keyof T;

    if (newData[typedKey] !== oldData[typedKey]) {
      result[key] =
        `${capitalize(key)} was updated from "${oldData[typedKey]}" to "${newData[typedKey]}"`;
    }
  }

  return result;
}
