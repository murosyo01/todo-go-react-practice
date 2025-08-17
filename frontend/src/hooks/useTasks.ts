import { useState, useEffect, useCallback } from "react";
import { Task, TaskFormValues } from "@/types/task";
import { getCurrentUser } from "@/services/authService";
import * as taskService from "@/services/taskService";

interface UseTasksReturn {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    createTask: (data: TaskFormValues) => Promise<void>;
    updateTask: (taskId: number, data: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
    updateTaskStatus: (taskId: number, newStatus: string) => Promise<void>;
    refreshTasks: (userId?: number) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTasks = useCallback(async (userId?: number) => {
        try {
            setLoading(true);
            setError(null);

            const user = getCurrentUser();
            const targetUserId = userId || user?.id;

            if (!targetUserId) {
                throw new Error("ユーザー情報が見つかりません");
            }

            const fetchedTasks = await taskService.getTaskByUser(targetUserId);
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

            const user = getCurrentUser();
            if (!user?.id) {
                throw new Error("ユーザー情報が見つかりません");
            }

            const taskData = {
                ...data,
                user_id: user.id
            };

            await taskService.createTask(taskData);
            await refreshTasks(user.id);
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

            await taskService.updateTask(taskId, data);

            const user = getCurrentUser();
            if (user?.id) {
                await refreshTasks(user.id);
            }
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

            await taskService.deleteTask(taskId);

            const user = getCurrentUser();
            if (user?.id) {
                await refreshTasks(user.id);
            }
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
            await updateTask(taskId, { status: newStatus });
        } catch (err) {
            console.error("Failed to update task status:", err);
        }
    }, [tasks, updateTask]);

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
