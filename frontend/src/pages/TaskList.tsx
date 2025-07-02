import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";

type Task = {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/tasks")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("タスクの取得に失敗しました");
                }
                return res.json();
            })
            .then((data) => {
                setTasks(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Spinner></Spinner>
    }
    if (error) {
        return <p>エラー：{error}</p>
    }
    return (
        <div>
            <h1>タスク一覧</h1>
            {tasks.length === 0 ? (
                <p>タスクがありません。</p>
            ): (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <h2>{task.title}</h2>
                            <p>{task.description}</p>
                            <p>ステータス: {task.status}</p>
                            <p>作成日時: {new Date(task.created_at).toLocaleString()}</p>
                            <p>更新日時: {new Date(task.updated_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
}

export default TaskList;