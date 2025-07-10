import { Task } from "@/hooks/useTasks";

interface TaskCardProps {
    task: Task;
    isDragging?: boolean;
    onClick?: (task: Task) => void;
}

export const TaskCard = ({ task, isDragging = false, onClick }: TaskCardProps) => (
    <div
        className={`w-full bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:bg-sky-100 transition-shadow duration-200 border border-gray-200 mb-3 cursor-pointer ${
            isDragging ? 'opacity-50 scale-105' : ''
        }`}
        onClick={!isDragging && onClick ? () => onClick(task) : undefined}
    >
        <h2 className="font-semibold text-gray-800 mb-1">{task.title}</h2>
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <p className="text-xs text-gray-400">
            更新日時: {new Date(task.updated_at).toLocaleString()}
        </p>
    </div>
);
