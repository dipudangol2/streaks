import { NextFunction, Request, Response } from "express";
import {
  HabitCreateInput,
  HabitUpdateInput,
  streakInput,
} from "../interfaces/types";
import {
  fetchAllHabits,
  habitCreate,
  fetchSingleHabit,
} from "../models/habit.model";
import prisma from "../config/db";
import { Prisma } from "@prisma/client";
import { isNextDay, isSameDay } from "../utils/utils";

interface HabitWithCheckins {
  id: string;
  title: string;
  description: string | null;
  frequency: string;
  startDate: Date;
  userId: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  checkins: Array<{
    id: string;
    habitId: string;
    date: Date;
  }>;
}

export const createHabit = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, frequency, startDate }: HabitCreateInput =
      request.body;
    const userId = request.userId!;

    const habit = await habitCreate({
      title,
      description,
      frequency,
      startDate,
      userId,
    });
    response.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
};

export const getAllHabits = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.userId!;
    const userHabits: any[] = await fetchAllHabits(userId);

    // Calculate live streak statuses based on current date
    const now = new Date();
    const mappedHabits = userHabits.map((habit) => {
      if (habit.streak && habit.streak.lastCheckinDate) {
        const lastCheckin = new Date(habit.streak.lastCheckinDate);
        if (!isSameDay(lastCheckin, now) && !isNextDay(lastCheckin, now)) {
          habit.streak.currentCount = 0;
        }
      }
      return habit;
    });

    console.log(`Habit fetched`);
    response.status(200).json({
      success: true,
      data: mappedHabits,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getHabit = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
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

  try {
    const habitId = request.params.id;
    const userId = request.userId!;
    const habit: any | null = await fetchSingleHabit(
      userId,
      habitId,
    );
    if (!habit) {
      response.status(400).json({
        sucess: false,
        message: "Habit Not Found",
      });
      return;
    }

    if (habit.streak && habit.streak.lastCheckinDate) {
      const lastCheckin = new Date(habit.streak.lastCheckinDate);
      if (!isSameDay(lastCheckin, now) && !isNextDay(lastCheckin, now)) {
        habit.streak.currentCount = 0;
      }
    }

    response.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    console.error("Error in getHabit:", error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const updateHabit = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const habitId = request.params.id;
    const userId = request.userId!;
    const { title, description, frequency }: HabitUpdateInput = request.body;

    const existingHabit = await prisma.habit.findUnique({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!existingHabit) {
      response.status(400).json({
        sucess: false,
        message: "Habit Not Found",
      });
      return;
    }
    const changes: HabitUpdateInput = {};
    if (title && title != existingHabit.title) {
      changes.title = title;
    }
    if (description && description != existingHabit.description) {
      changes.description = description;
    }
    if (frequency && frequency != existingHabit.frequency) {
      changes.frequency = frequency;
    }

    if (Object.keys(changes).length === 0) {
      response.status(200).json({
        message: "No changes detected",
        habit: existingHabit,
      });
      return;
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        ...changes,
      },
    });

    response.status(200).json(updatedHabit);
  } catch (error) {
    console.error("Error in updateHabit:", error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const deleteHabit = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const habitId = request.params.id;
    const userId = request.userId!;
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });
    if (!habit) {
      response.status(404).json({
        success: false,
        message: "Habit not found",
      });
      return;
    }
    if (habit.userId !== userId) {
      response.status(403).json({
        success: false,
        message: "Not authorized to delete this habit",
      });
      return;
    }
    await prisma.$transaction([
      prisma.habitCheckin.deleteMany({ where: { habitId } }),
      prisma.streak.deleteMany({ where: { habitId } }),
      prisma.habit.delete({ where: { id: habitId } }),
    ]);

    response.status(204).end();
  } catch (error) {
    console.error("Error in deleteHabit:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        response.status(404).json({
          success: false,
          message: "Habit not found",
        });
        return;
      }
    }

    response.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const habitCheckin = async (request: Request, response: Response) => {
  try {
    const habitId = request.params.id;
    const userId = request.userId!;

    //? Set up dates for check-in
    const now = new Date();
    const checkinDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const startOfDay = checkinDate;
    const endOfDay = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    //? Verify habit exists and belongs to user
    const habit = await prisma.habit.findUnique({
      where: { id: habitId, userId },
    });
    if (!habit) {
      response.status(404).json({
        success: false,
        message: "Habit not found",
      });
      return;
    }

    //?Create transaction to handle check-in and streak update atomically
    const { checkin } = await prisma.$transaction(async (tx) => {
      //? Check existing duplicate habit checkin
      const existingCheckin = await tx.habitCheckin.findFirst({
        where: {
          habitId,
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });
      if (existingCheckin) throw new Error("USER_ALREADY_CHECKED_IN");

      // ? fetch current streak and calculate new values
      const currentStreak = await tx.streak.findUnique({
        where: { habitId },
      });
      const isConsecutive = currentStreak?.lastCheckinDate
        ? isNextDay(currentStreak.lastCheckinDate, checkinDate)
        : false;

      const newCurrentStreak = isConsecutive
        ? currentStreak!.currentCount + 1
        : 1;
      const newLongest = Math.max(
        currentStreak?.longestCount || 1,
        newCurrentStreak,
      );
      //? checkin habit
      const checkin = await tx.habitCheckin.create({
        data: { habitId, date: now },
      });

      //? upsert streak
      const streak = await tx.streak.upsert({
        where: { habitId },
        update: {
          currentCount: newCurrentStreak,
          longestCount: newLongest,
          lastCheckinDate: checkinDate,
        },
        create: {
          habitId,
          currentCount: 1,
          longestCount: 1,
          lastCheckinDate: checkinDate,
        },
      });

      return { checkin };
    });

    response.status(201).json({
      success: true,
      data: checkin,
    });
  } catch (error: any) {
    if (error.message.includes("USER_ALREADY_CHECKED_IN")) {
      //? return response so that we don't send multiple responses in case of other errors
      return response.status(409).json({
        success: false,
        message: "Already checked in today",
      });
    }
    // console.error(error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
