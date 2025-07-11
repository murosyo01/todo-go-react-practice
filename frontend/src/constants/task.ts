export const TASK_COLUMNS = ["未着手", "進行中", "完了"] as const;

export const API_ENDPOINTS = {
    TASKS: "http://localhost:8080/tasks",
    TASK_BY_ID: (id: number) => `http://localhost:8080/tasks/${id}`,
} as const;

export const DRAG_ACTIVATION_DISTANCE = 3;

export const TASK_STATUS_COLORS = {
    "未着手": "bg-gray-100 border-gray-300",
    "進行中": "bg-blue-100 border-blue-300", 
    "完了": "bg-green-100 border-green-300",
} as const;
