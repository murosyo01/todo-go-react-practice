import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Task, FormValues } from "@/types/task";

type TaskDialogProps = {
    open: boolean;
    initialValues?: FormValues;
    isEditMode: boolean;
    onSubmit: (data: FormValues) => void;
    onOpenChange: (open: boolean) => void;
};

const FormSchema = z.object({
    title: z.string().min(1, "タイトルは必須です"),
    description: z.string().optional(),
    status: z.enum(["未着手", "進行中", "完了"]),
});

export const TaskDialog = ({
    open,
    initialValues,
    isEditMode,
    onSubmit,
    onOpenChange,
}: TaskDialogProps) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialValues || {
            title: "",
            description: "",
            status: "未着手",
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
                    <DialogTitle>{isEditMode ? "タスク編集" : "新規タスク"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                        noValidate
                    >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>タイトル</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        className="border rounded p-2 w-full"
                                        placeholder="タイトル"
                                    />
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
                                    <textarea
                                        {...field}
                                        className="border rounded p-2 w-full"
                                        placeholder="説明"
                                    />
                                </FormControl>
                                <FormMessage />
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
                                        {["未着手", "進行中", "完了"].map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit">保存</Button>
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
