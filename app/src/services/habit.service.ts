import { api } from "../lib/api";

interface ApiSuccess<T> {
  success: boolean;
  data: T;
}

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
  getAll: async (): Promise<ApiSuccess<Habit[]>> => {
    return api.get<ApiSuccess<Habit[]>>("/habits");
  },

  getById: async (id: string): Promise<ApiSuccess<Habit>> => {
    return api.get<ApiSuccess<Habit>>(`/habits/${id}`);
  },

  create: async (habit: HabitInput): Promise<ApiSuccess<Habit>> => {
    return api.post<ApiSuccess<Habit>, HabitInput>("/habits", habit);
  },

  update: async (id: string, habit: Partial<HabitInput>): Promise<Habit | { message: string; habit: Habit }> => {
    return api.put<Habit | { message: string; habit: Habit }, Partial<HabitInput>>(`/habits/${id}`, habit);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/habits/${id}`);
  },

  checkin: async (id: string): Promise<ApiSuccess<unknown>> => {
    return api.post<ApiSuccess<unknown>, Record<string, never>>(`/habits/${id}/checkin`, {});
  }
};
