import { useState, useEffect } from "react";

export type Task = {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = () => {
        setLoading(true);
        fetch("http://localhost:8080/tasks")
            .then((res) => res.json())
            .then(setTasks)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    const createTask = (data: Partial<Task>) => {
        setLoading(true);
        fetch("http://localhost:8080/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(() => fetchTasks())
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    const updateTask = (taskId: number, updatedData: Partial<Task>) => {
        setLoading(true);
        fetch(`http://localhost:8080/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        })
            .then((res) => res.json())
            .then(() => fetchTasks())
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    const deleteTask = (taskId: number) => {
        setLoading(true);
        fetch(`http://localhost:8080/tasks/${taskId}`, {
            method: "DELETE",
        })
            .then(() => fetchTasks())
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    const updateTaskStatus = (taskId: number, newStatus: string) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.status === newStatus) return;
        
        const updatedTask = {
            ...task,
            status: newStatus,
        };
        updateTask(taskId, updatedTask);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        fetchTasks,
    };
};
