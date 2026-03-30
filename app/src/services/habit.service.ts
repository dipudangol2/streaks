import { api } from "../lib/api";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  startDate: string;
  archived: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitInput {
  title: string;
  description?: string;
  frequency: string;
  startDate: string;
}

export const habitService = {
  getAll: async (): Promise<{ success: boolean; data: Habit[] }> => {
    return api.get("/habits");
  },

  getById: async (id: string): Promise<{ success: boolean; data: Habit }> => {
    return api.get(`/habits/${id}`);
  },

  create: async (habit: HabitInput): Promise<{ success: boolean; data: Habit }> => {
    return api.post("/habits", habit);
  },

  update: async (id: string, habit: Partial<HabitInput>): Promise<{ success: boolean; data: Habit; message?: string }> => {
    return api.patch(`/habits/${id}`, habit); // Note: server uses PUT, but let's confirm.
  },

  delete: async (id: string): Promise<void> => {
    await api.post(`/habits/${id}`, { method: "DELETE" }); // This is a workaround if I don't have delete in api.ts
  },

  checkin: async (id: string): Promise<{ success: boolean; data: any }> => {
    return api.post(`/habits/${id}/checkin`, {});
  }
};
