import prisma from "../config/db";
import { HabitInput } from "../interfaces/types";

const now = new Date();
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const endOfDay = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  23,
  59,
  59,
  999,
);

export const habitCreate = async (data: HabitInput) => {
  return await prisma.habit.create({ data });
};

export const fetchSingleHabit = async (userId: string, habitId: string) => {
  return await prisma.habit.findUnique({
    where: {
      id: habitId,
      userId,
    },
    include: {
      checkins: {
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        take: 1,
      },
      streak: true,
    },
  });
};
export const fetchAllHabits = async (userId: string) => {
  return await prisma.habit.findMany({
    where: { userId: userId },
    include: {
      checkins: {
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        take: 1,
      },
      streak: true,
    },
  });
};
