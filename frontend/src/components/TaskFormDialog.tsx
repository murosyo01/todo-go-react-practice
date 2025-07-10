import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Task } from "@/hooks/useTasks";

const FormSchema = z.object({
    title: z.string().min(1, "タイトルは必須です"),
    description: z.string().optional(),
    status: z.enum(["未着手", "進行中", "完了"]),
});

type FormValues = z.infer<typeof FormSchema>;

const columns = ["未着手", "進行中", "完了"] as const;

interface TaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditMode: boolean;
    selectedTask: Task | null;
    onSubmit: (data: FormValues) => void;
}

export const TaskFormDialog = ({ 
    open, 
    onOpenChange, 
    isEditMode, 
    selectedTask, 
    onSubmit 
}: TaskFormDialogProps) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: selectedTask?.title || "",
            description: selectedTask?.description || "",
            status: (selectedTask?.status as "未着手" | "進行中" | "完了") || "未着手",
        },
    });

    const handleSubmit = (data: FormValues) => {
        onSubmit(data);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'タスク編集' : '新規タスク'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>タイトル</FormLabel>
                                    <FormControl>
                                        <input {...field} className="border rounded p-2 w-full" placeholder="タイトル" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>説明</FormLabel>
                                    <FormControl>
                                        <textarea {...field} className="border rounded p-2 w-full" placeholder="説明" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ステータス</FormLabel>
                                    <FormControl>
                                        <select {...field} className="border rounded p-2 w-full">
                                            {columns.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">保存</Button>
                            <DialogClose asChild>
                                <Button variant="outline">キャンセル</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
