import { Template } from "./templateInterface";

export const fetcher = async () => {
  const response = await fetch("http://localhost:4000/templates");
  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }
  return response.json();
};

export const createTemplate = async (template: Partial<Template>) => {
  const response = await fetch("http://localhost:4000/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(template),
  });
  if (!response.ok) {
    throw new Error("Failed to create template");
  }
  return response.json();
};