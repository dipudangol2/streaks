import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {api} from "@/lib/api";
import type { Habit } from "@/types/habit";

//? Habit Create Input Schema from frontend:  { title, description, frequency, startDate }
/*
? API Endpoints for Habits: 
* habitRoutes.post("/", verifyToken, createHabit);
* habitRoutes.get("/", verifyToken, getAllHabits);
* habitRoutes.put("/:id", verifyToken, updateHabit);
* habitRoutes.delete("/:id", verifyToken, deleteHabit);
* habitRoutes.get("/:id", verifyToken, getHabit);
* habitRoutes.post("/:id/checkin", verifyToken, habitCheckin);
*/

const HabitForm = () => {
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [frequency,setFrequency] = useState("");
  const [startDate,setStartDate] = useState(new Date());

  const frequencyLabel = frequency
    ? `${frequency.charAt(0).toUpperCase()}${frequency.slice(1)}`
    : "Select Frequency";

  type CreateHabitPayload = {
    title: string;
    description: string;
    frequency: string;
    startDate: string;
  };

  type CreateHabitResponse = {
    success: boolean;
    data: Habit;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //? Validate form data and show error in a toast if any field is missing
    if (!title || !description || !frequency) {
      toast.error("Please fill in all the fields");
      return;
    }
    // TODO:Call API to create habit with the form data
    try{
      const response = await api.post<CreateHabitResponse, CreateHabitPayload>("/habits", {
        title,
        description,
        frequency: frequency.toUpperCase(),
        startDate: startDate.toISOString(),
      });
      if (response.success) {
        toast.success(`Habit created: ${response.data.title}`);
      }
    }
    catch(error){
      toast.error(`
        Error during habit creation: ${(error as Error).message}` || "An error occurred while creating the habit");
      return;
    }

    setTitle("");
    setDescription("");
    setFrequency("");
    setStartDate(new Date());
    console.log({title, description, frequency, startDate});
  }

  return (
    <div >
      <form
      className="p-4 flex flex-col space-y-4 w-4/5 mx-auto"
       onSubmit={handleSubmit}
       >
        <span>Habit Title</span>
        <input
          type="text"
          placeholder="Habit Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded bg-gray-200"
        />
        <span>Habit Description</span>
        <input
          type="text"
          placeholder="Habit Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded bg-gray-200"
        />
        {/* create a dropdown for frequency with options daily, weekly, monthly using shadcn dropdown menu */}
        <div className="py-1 flex justify-start items-center gap-4">
        <span>Frequency</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="relative inline-flex items-center gap-1 pb-0.5 after:absolute after:-bottom-0.5 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-current after:transition-all after:duration-300 hover:after:w-full data-[state=open]:after:w-full">
            {frequencyLabel}
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setFrequency("daily")}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFrequency("weekly")}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFrequency("monthly")}>
              Monthly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <span>Start Date</span>
        <input
          type="date"
          placeholder="Start Date"
          value={startDate.toISOString().split("T")[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
        <button
         type="submit"
         className="bg-gray-900 text-white p-2 border rounded-xl hover:bg-gray-700 transition-colors duration-400"
         >
          Create Habit
          </button>
      </form>
    </div>
  )
}

export default HabitForm