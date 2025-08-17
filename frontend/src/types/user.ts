import { z } from "zod";

export const UserFormSchema = z.object({
    username: z.string().min(1, "ユーザー名は必須です"),
    mail_address: z.string().min(1, "メールアドレスは必須です").email("有効なメールアドレスを入力してください"),
    password: z.string().min(6, "パスワードは6文字以上で入力してください"),
    confirmPassword: z.string().min(6, "確認用パスードは6文字以上で入力してください")
});

export type UserFormValues = z.infer<typeof UserFormSchema>;

export type User = {
    id: number;
    username: string;
    mail_address: string;
    created_at: string;
    updated_at: string;
};