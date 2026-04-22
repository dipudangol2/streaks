import { useRef, useState, useEffect } from "react";
import type { HabitWithCheckins } from "../../../types/habit";
import { Pencil, Check, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

//Editable Input field
const EditField = ({
  value,
  label,
  fieldKey,
  onLocalSave,
}: {
  value: string;
  label: string;
  fieldKey: string;
  onLocalSave: (key: string, newValue: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);
  //set temp to value in case the draft is resetted.
  useEffect(() => {
    setTemp(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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
    <div className="flex flex-col mb-4 gap-2">
      <span className="font-bold text-sm text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          // When the field is editable
          <>
            <input
              ref={inputRef}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
                if (e.key === "Escape") {
                  handleCancel();
                }
              }}
              className="border"
            />
            <button onClick={handleSave}>
              <Check size={18} />
            </button>
            <button onClick={handleCancel}>
              <X size={18} />
            </button>
          </>
        ) : (
          // When the field is not editable
          <>
            <span>{value || "No value provided"}</span>
            <button onClick={() => setIsEditing(true)}>
              <Pencil size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const HabitInfo = ({
  habit,
  onSuccess,
}: {
  habit: HabitWithCheckins;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const [habitDraft, setHabitDraft] = useState({
    title: habit.title,
    description: habit.description || "",
  });

  const handleDraftUpdate = (key: string, newValue: string) => {
    setHabitDraft((prev) => ({ ...prev, [key]: newValue }));
  };
  const yadayada = () => {
    onsuccess?.();
  };
  const handleEdit = () => {};
  // wip: this component is meant to display detailed information about a habit, including its check-in status. the `onsuccess` callback can be used to trigger any additional actions after displaying the habit info, such as refreshing the habit list or closing a modal.
  return (
    <div className="flex flex-col justify-center p-4 space-y-4 w-4/5 mx-auto">
      <span className="font-bold">habit title</span>
      {/*<div>
        <input
          ref={habitTitleRef}
          value={habitTitle}
          readOnly={!edithabitTitle}
          onChange={(e) => setHabitTitle(e.target.value)}
        />
        <button onClick={handleEdit()}>
          <Pencil />
        </button>
      </div>*/}
      <EditField
        label="ungabunga"
        value="testvalue"
        fieldKey="title"
        onLocalSave={handleDraftUpdate}
      />
      <div>{habit.description}</div>
      <div>{habit.frequency}</div>
      <div>{habit.startDate}</div>
      <div>{habit.userId}</div>
      <div>{habit.createdAt}</div>
      <div>{habit.updatedAt}</div>
      <div>
        {habit.checkins.some(() => true)
          ? "The habit is already checked-in"
          : "false"}
      </div>
    </div>
  );
};

export default HabitInfo;
