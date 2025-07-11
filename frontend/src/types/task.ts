import { z } from "zod";

// ステータス列挙型
export const StatusEnum = z.enum(["未着手", "進行中", "完了"]);
export type Status = z.infer<typeof StatusEnum>;

// フォームバリデーション用Schema
export const TaskFormSchema = z.object({
    title: z.string().min(1, "タイトルは必須です"),
    description: z.string().optional(),
    status: StatusEnum,
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;

// タスクデータ型
export type Task = {
    id: number;
    title: string;
    description: string;
    status: Status;
    created_at: string;
    updated_at: string;
};
