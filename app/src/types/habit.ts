export interface Habit {
    id?: string;
    title: string;
    description?: string | null;
    frequency: string;
    startDate: Date;
    userId: string;     
    archived?: boolean; 
    createdAt?: Date;    
    updatedAt?: Date; 
}