const API_BASE_URL = 'http://localhost:8080';

export const getTaskByUser = async (userId: number) => {
    console.log(userId);
    const response = await fetch(`${API_BASE_URL}/tasks?user_id=${userId}`);
    if (!response.ok) {
        throw new Error("タスクの取得に失敗しました");
    }
    return response.json();
};

export const createTask = async (task: { 
    title: string; 
    description: string; 
    status: string; 
    user_id: number 
}) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        throw new Error('タスクの作成に失敗しました');
    }
    return response.json();
};

export const updateTask = async (taskId: number, task: Partial<{
    title: string;
    description: string;
    status: string;
}>) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        throw new Error('タスクの更新に失敗しました');
    }
    return response.json();
};

export const deleteTask = async (taskId: number) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('タスクの削除に失敗しました');
    }
    return response.json();
};
