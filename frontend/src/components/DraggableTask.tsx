import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/hooks/useTasks";
import { TaskCard } from "./TaskCard";

interface DraggableTaskProps {
    task: Task;
    onTaskClick: (task: Task) => void;
}

export const DraggableTask = ({ task, onTaskClick }: DraggableTaskProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useDraggable({
        id: task.id.toString(),
        data: { task }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        >
            <TaskCard task={task} isDragging={isDragging} onClick={onTaskClick} />
        </div>
    );
};
