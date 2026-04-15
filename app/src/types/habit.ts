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
}

export interface HabitWithCheckins extends Habit {
  checkins: HabitCheckin[];
}