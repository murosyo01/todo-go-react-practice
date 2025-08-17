import { useDraggable } from "@dnd-kit/core";
import { Task } from "@/types/task";

type TaskItemProps = {
    task: Task;
    onClick: (task: Task) => void;
};

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: task.id.toString(),
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="border rounded p-2 m-2 bg-white shadow cursor-pointer"
            onClick={() => onClick(task)}
        >
            <h2 className="font-bold">{task.title}</h2>
            <p className="text-sm">{task.description}</p>
            <p className="text-xs text-gray-500">
                更新日時: {new Date(task.updated_at).toLocaleString()}
            </p>
        </div>
    );
};
