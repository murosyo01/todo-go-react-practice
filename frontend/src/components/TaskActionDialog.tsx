import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Task } from "@/hooks/useTasks";

interface TaskActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedTask: Task | null;
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
}

export const TaskActionDialog = ({
    open,
    onOpenChange,
    selectedTask,
    onEdit,
    onDelete
}: TaskActionDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogDescription>
                    <h4 className="font-bold text-lg mb-2">
                        タイトル：{selectedTask?.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                        説明：{selectedTask?.description || "なし"}
                    </p>
                </DialogDescription>
                <div className="flex gap-2 mt-4">
                    <Button
                        onClick={() => {
                            if (selectedTask) {
                                onEdit(selectedTask);
                                onOpenChange(false);
                            }
                        }}
                    >
                        更新
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (selectedTask) {
                                onDelete(selectedTask.id);
                                onOpenChange(false);
                            }
                        }}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        削除
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">キャンセル</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};
