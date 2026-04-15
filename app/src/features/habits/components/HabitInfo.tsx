import type { HabitWithCheckins } from "../../../types/habit";

const HabitInfo = ({
  habit,
  onSuccess,
}: {
  habit: HabitWithCheckins;
  onSuccess?: () => void;
}) => {
  const yadayada = () => {
    onSuccess?.();
  }
  // WIP: This component is meant to display detailed information about a habit, including its check-in status. The `onSuccess` callback can be used to trigger any additional actions after displaying the habit info, such as refreshing the habit list or closing a modal.
  return (
    <>
      <div>{habit.id}</div>
      <div>{habit.title}</div>
      <div>{habit.description}</div>
      <div>{habit.frequency}</div>
      <div>{habit.startDate}</div>
      <div>{habit.userId}</div>
      <div>{habit.createdAt}</div>
      <div>{habit.updatedAt}</div>
      <div>{habit.checkins.some(()=>true)  ? "The habit is already checked-in" : "false"}</div>
      
    </>
  );
};

export default HabitInfo;
