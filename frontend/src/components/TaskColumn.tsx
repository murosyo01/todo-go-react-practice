import { useDroppable } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";

type TaskColumnProps = {
    status: string;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
};

export const TaskColumn = ({ status, tasks, onTaskClick }: TaskColumnProps) => {
    const { setNodeRef } = useDroppable({ id: status });

    const filteredTasks = tasks.filter((t) => t.status === status);

    return (
        <div
            ref={setNodeRef}
            className="w-1/3 p-4 border rounded min-h-[300px] bg-gray-100"
        >
            <h3 className="font-bold text-lg mb-2">{status}</h3>
            {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} onClick={onTaskClick} />
            ))}
        </div>
    );
};
