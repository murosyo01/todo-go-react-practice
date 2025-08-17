import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/authService";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from "react-toastify";
import { useTasks } from "@/hooks/useTasks";

const loginSchema = z.object({
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z.string().min(6, "パスワードは6文字以上で入力してください")
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ isRevealPassword, setIsRevealPassword ] = useState(false);

    const togglePassword = () => {
        setIsRevealPassword((prevState) => !prevState);
    }

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const handleLogin = async (data: LoginFormValues) => {
        setIsLoading(true);

        try {
            const response = await loginUser({
                mail_address: data.email,
                password: data.password
            });
            console.log('Login successful:', response);
            toast.success("ログインに成功しました！");
            navigate("/tasks");
        } catch (error: any) {
            toast.error(error.message || "ログインに失敗しました。");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-fuchsia-200 to-cyan-200">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>ログイン</CardTitle>
                    <CardDescription>アカウントにログインしてください</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} className="space-y-4">
                        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-black-500">
                                            メールアドレス
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="メールアドレス"
                                                {...field}
                                                className="w-full p-2 border rounded"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-black-500">
                                            パスワード
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative w-full">
                                                <Input
                                                    type={isRevealPassword ? "text" : "password"}
                                                    placeholder="パスワード"
                                                    {...field}
                                                    className="w-full p-2 border rounded pr-10"
                                                />
                                                <span
                                                    onClick={togglePassword}
                                                    role="presentation"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                                >
                                                    {isRevealPassword ? (
                                                        <VisibilityOffIcon className="text-black-500" />
                                                    ) : (
                                                        <VisibilityIcon className="text-black-500" />
                                                    )}
                                                </span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "ログイン中..." : "ログイン"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-gray-500">
                        アカウントをお持ちでない方は{" "}
                        <Button
                            variant="link"
                            onClick={() => navigate("/register")}
                            className="text-blue-500 hover:underline"
                        >
                            新規ユーザ登録はこちら
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}