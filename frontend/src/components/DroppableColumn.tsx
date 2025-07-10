import { useDroppable } from "@dnd-kit/core";
import { Task } from "@/hooks/useTasks";
import { DraggableTask } from "./DraggableTask";

interface DroppableColumnProps {
    status: string;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

export const DroppableColumn = ({ status, tasks, onTaskClick }: DroppableColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const filteredTasks = tasks.filter((t) => t.status === status);

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 min-h-[500px] border-2 rounded-lg p-4 m-2 bg-gray-50 transition-colors duration-200 ${
                isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
            }`}
        >
            <h3 className="font-bold text-lg mb-4 text-gray-700 sticky top-0 bg-gray-50 pb-2">
                {status} ({filteredTasks.length})
            </h3>
            <div className="space-y-2">
                {filteredTasks.map((task) => (
                    <DraggableTask key={task.id} task={task} onTaskClick={onTaskClick} />
                ))}
            </div>
        </div>
    );
};
