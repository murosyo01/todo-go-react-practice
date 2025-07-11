import { useState, useEffect, useCallback } from "react";
import { Task, TaskFormValues } from "@/types/task";

interface UseTasksReturn {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    createTask: (data: TaskFormValues) => Promise<void>;
    updateTask: (taskId: number, data: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
    updateTaskStatus: (taskId: number, newStatus: string) => Promise<void>;
    refreshTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("http://localhost:8080/tasks");
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.statusText}`);
            }
            const fetchedTasks = await response.json();
            setTasks(fetchedTasks);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = useCallback(async (data: TaskFormValues) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("http://localhost:8080/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Failed to create task: ${response.statusText}`);
            }
            await refreshTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create task");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshTasks]);

    const updateTask = useCallback(async (taskId: number, data: Partial<Task>) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Failed to update task: ${response.statusText}`);
            }
            await refreshTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update task");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshTasks]);

    const deleteTask = useCallback(async (taskId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Failed to delete task: ${response.statusText}`);
            }
            await refreshTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete task");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshTasks]);

    const updateTaskStatus = useCallback(async (taskId: number, newStatus: string) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.status === newStatus) return;
        
        try {
            await updateTask(taskId, { ...task, status: newStatus });
        } catch (err) {
            console.error("Failed to update task status:", err);
        }
    }, [tasks, updateTask]);

    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        refreshTasks,
    };
};
