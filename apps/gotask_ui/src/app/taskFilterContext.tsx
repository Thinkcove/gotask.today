// context/TaskFilterContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TaskFilters {
  view: "projects" | "users" | null;
  minDate?: string;
  maxDate?: string;
  moreDays?: string;
  lessDays?: string;
  dateVar?: string;
  page?: number;
  statusFilter?: string[];
  severityFilter?: string[];
  projectFilter?: string[];
  userFilter?: string[];
}

interface TaskFilterContextType {
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
}

const TaskFilterContext = createContext<TaskFilterContextType | undefined>(undefined);

export const TaskFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<TaskFilters>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("task_filters");
      return saved ? JSON.parse(saved) : { view: null, page: 1 };
    }
    return { view: null, page: 1 };
  });

  useEffect(() => {
    sessionStorage.setItem("task_filters", JSON.stringify(filters));
  }, [filters]);

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      minDate: "",
      maxDate: "",
      moreDays: "",
      lessDays: "",
      dateVar: "due_date",
      page: 1,
      statusFilter: [],
      severityFilter: [],
      projectFilter: [],
      userFilter: []
    }));
  };

  return (
    <TaskFilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </TaskFilterContext.Provider>
  );
};

export const useTaskFilters = () => {
  const context = useContext(TaskFilterContext);
  if (!context) {
    throw new Error("useTaskFilters must be used within a TaskFilterProvider");
  }
  return context;
};
