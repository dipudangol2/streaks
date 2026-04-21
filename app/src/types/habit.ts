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

type HabitCheckin = {
  id: string;
  habitId: string;
  date: Date;
};
// "streak": {
//         "id": "9fe086aa-bd54-4c26-bcac-f6eb8ab6eb21",
//         "habitId": "1a5ce48f-971c-4c03-8fcc-dd6e7f3bfaa6",
//         "currentCount": 2,
//         "longestCount": 2,
//         "lastCheckinDate": "2026-04-21T00:00:00.000Z"
//       }
export interface HabitWithCheckins extends Habit {
  checkins: HabitCheckin[];
  streak?: {
    id: string;
    habitId: string;
    currentCount: number;
    longestCount: number;
    lastCheckinDate: Date;
  };
}
