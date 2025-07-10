import { useState } from "react";
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    DragOverlay,
    closestCenter
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useTasks, Task } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { DroppableColumn } from "@/components/DroppableColumn";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { TaskActionDialog } from "@/components/TaskActionDialog";

const columns = ["未着手", "進行中", "完了"] as const;

export default function TaskList() {
    const { 
        tasks, 
        loading, 
        error, 
        createTask, 
        updateTask, 
        deleteTask, 
        updateTaskStatus 
    } = useTasks();

    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showActionDialog, setShowActionDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    );

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setShowActionDialog(true);
    };

    const handleFormSubmit = (data: any) => {
        if (isEditMode && selectedTask) {
            updateTask(selectedTask.id, data);
        } else {
            createTask(data);
        }
        setShowEditDialog(false);
        setSelectedTask(null);
        setIsEditMode(false);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsEditMode(true);
        setShowEditDialog(true);
    };

    const handleDeleteTask = (taskId: number) => {
        deleteTask(taskId);
    };

    const handleDragStart = (event: any) => {
        const task = tasks.find(t => t.id.toString() === event.active.id);
        setActiveTask(task || null);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveTask(null);

        if (over && active && active.id !== over.id) {
            const taskId = parseInt(active.id as string);
            const newStatus = over.id as string;
            updateTaskStatus(taskId, newStatus);
        }
    };

    const handleAddTask = () => {
        setIsEditMode(false);
        setSelectedTask(null);
        setShowEditDialog(true);
    };

    if (loading) return <div className="flex justify-center items-center h-64"><p>Loading...</p></div>;
    if (error) return <div className="text-red-500 text-center"><p>{error}</p></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gradient-to-r from-fuchsia-200 from-0% to-cyan-200 to-100%">
            <h1 className="text-3xl mb-6 font-bold text-gray-800">タスク一覧</h1>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        onClick={handleAddTask}
                        className="mb-6"
                    >
                        タスク追加
                    </Button>
                </DialogTrigger>
            </Dialog>

            <TaskFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                isEditMode={isEditMode}
                selectedTask={selectedTask}
                onSubmit={handleFormSubmit}
            />

            <TaskActionDialog
                open={showActionDialog}
                onOpenChange={setShowActionDialog}
                selectedTask={selectedTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
            />

            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                collisionDetection={closestCenter}
            >
                <div className="flex gap-4 mt-8 min-h-[600px]">
                    {columns.map((status) => (
                        <DroppableColumn 
                            key={status} 
                            status={status} 
                            tasks={tasks}
                            onTaskClick={handleTaskClick}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="scale-110">
                            <TaskCard task={activeTask} isDragging={true} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
