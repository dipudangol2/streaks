import { useRef, useState, useEffect } from "react";
import type { HabitWithCheckins } from "../../../types/habit";
import { Pencil, Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { habitService } from "@/services/habit.service";
import { toast } from "sonner";

//Editable Input field
const EditField = ({
  className,
  value,
  label,
  fieldKey,
  onLocalSave,
}: {
  className: string;
  value: string;
  label: string;
  fieldKey: string;
  onLocalSave: (key: string, newValue: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value || "");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  //set temp to value in case the draft is resetted.
  useEffect(() => {
    setTemp(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(temp.length, temp.length);
    }
  }, [isEditing, temp.length]);

  const handleSave = () => {
    if (temp.trim() !== "") {
      onLocalSave(fieldKey, temp.trim()); // Send draft to parent
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTemp(value || ""); //Revert the value
    setIsEditing(false);
  };

  return (
    <div className={className}>
      <div className="flex flex-col mb-4 gap-2">
        <span className="font-bold text-sm ">{label}</span>
        <div className="flex items-center h-8 relative">
          <div
            className={`flex items-center gap-2 overflow-hidden transition-all ease-out w-full ${
              isEditing
                ? "max-w-[1000px] opacity-100 duration-700"
                : "max-w-0 opacity-0 duration-200"
            }`}
          >
            <textarea
              ref={inputRef}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === "Escape") handleCancel();
              }}
              className="border-b border-primary bg-transparent focus:outline-none px-1 flex-1 text-wrap resize-none"
              rows={1}
            />
            <button
              onClick={handleSave}
              className="text-green-500 hover:bg-green-900/30 p-1 rounded-full shrink-0"
            >
              <Check size={18} />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-500 hover:bg-red-900/30 p-1 rounded-full shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <div
            className={`flex items-center gap-2 overflow-hidden transition-all ease-out absolute left-0 w-full ${
              !isEditing
                ? "max-w-[1000px] opacity-100 duration-700 delay-100"
                : "max-w-0 opacity-0 duration-200"
            }`}
          >
            <span className="break-words line-clamp-1 w-[calc(100%-2rem)]">
              {value || "No value provided"}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-200 p-1 shrink-0"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
TODO:
  - Add a streak counter for the clicked habit
  - Add a longest streak for the habit
  - Allow checkin from the details if not already checked in from the dashboard
  - Enable frequency editing once Weekly/Monthly check-in logic is implemented.
    Currently restricted to 'daily' to prevent inconsistent streak calculations.
*/
const HabitInfo = ({
  habit,
  onSuccess,
}: {
  habit: HabitWithCheckins;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  //* The fields which can be edited in the HabitInfo component when viewing the habit details
  type HabitDraft = Pick<HabitWithCheckins, "title" | "description">;
  const [habitDraft, setHabitDraft] = useState<HabitDraft>({
    title: habit.title,
    description: habit.description || "",
  });

  // * Check if there are any changes by comparing the draft to original
  const hasChanges =
    habitDraft.title !== habit.title ||
    habitDraft.description !== (habit.description || "");

  // * Handles the draft value change in the habit info modal

  const handleDraftUpdate = (key: string, newValue: string) => {
    setHabitDraft((prev) => ({ ...prev, [key]: newValue }));
  };

  // INFO: function for database mutation (Write to database)
  const updateMutation = useMutation({
    mutationFn: () => habitService.update(habit.id, habitDraft),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["habits"],
      });
      toast.success("Habit updated successfully");
      onSuccess?.(); //Close the modal
    },
    onError: () => toast.error("Failed to update habit."),
  });

  return (
    <div className="flex flex-col p-4 w-full mx-auto h-full">
      <EditField
        label="Habit Title"
        value={habitDraft.title}
        fieldKey="title"
        onLocalSave={handleDraftUpdate}
        className="w-full mb-4"
      />
      <EditField
        label="Habit Description"
        value={habitDraft.description!}
        fieldKey="description"
        onLocalSave={handleDraftUpdate}
        className="w-full mb-6"
      />

      <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-auto">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm text-gray-500">Frequency</span>
          <span>{habit.frequency}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm text-gray-500">Start Date</span>
          <span>{new Date(habit.startDate).toISOString().split("T")[0]}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm text-gray-500">Created At</span>
          <span>{new Date(habit.createdAt).toISOString().split("T")[0]}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm text-gray-500">Updated At</span>
          <span>{new Date(habit.updatedAt).toISOString().split("T")[0]}</span>
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <span className="font-bold text-sm text-gray-500">
            Check-in Status
          </span>
          <span>
            {habit.checkins.some(() => true)
              ? "✅ Checked-in"
              : "❌ Not checked-in"}
          </span>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-border flex justify-end gap-3 w-full">
        {hasChanges && (
          <button
            onClick={() =>
              setHabitDraft({
                title: habit.title,
                description: habit.description || "",
              })
            }
            className="px-4 py-2 text-sm text-white bg-red-700 hover:bg-red-600 rounded-md transition-colors"
            disabled={updateMutation.isPending}
          >
            Discard Changes
          </button>
        )}
        <button
          onClick={() => updateMutation.mutate()}
          disabled={!hasChanges || updateMutation.isPending}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            hasChanges
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default HabitInfo;
