import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const registerSchema = z.object({
    username: z.string().min(1, "ユーザー名を入力してください"),
    mail_address: z.string().email("有効なメールアドレスを入力してください"),
    password: z.string().min(6, "パスワードは6文字以上で入力してください"),
    confirmPassword: z.string().min(6, "パスワード確認は6文字以上で入力してください")
}).refine((data) => data.password === data.confirmPassword, {
    message: "パスワードとパスワード確認が一致しません",
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [username, setUsername] = useState("");
    const [mail_address, setMailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

    const [ isRevealPassword, setIsRevealPassword ] = useState(false);

    const togglePassword = () => {
        setIsRevealPassword((prevState) => !prevState);
    }

    const [ isRevealConfirmPassword, setIsRevealConfirmPassword ] = useState(false);

    const toggleConfirmPassword = () => {
        setIsRevealConfirmPassword((prevState) => !prevState);
    }

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            mail_address: "",
            password: "",
            confirmPassword: ""
        }
    });

    const handleRegister = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await registerUser({
                username: data.username,
                mail_address: data.mail_address,
                password: data.password
            });
            toast.success("アカウントが作成されました。");
            navigate("/login");
        }
        catch (error: any) {
            toast.error("登録に失敗しました。もう一度お試しください。");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-fuchsia-200 to-cyan-200">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>新規登録</CardTitle>
                    <CardDescription>アカウントを作成してください</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} className="space-y-4">
                        <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-black-500">
                                            ユーザー名
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="ユーザー名"
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
                                name="mail_address"
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-black-500">
                                            パスワード確認
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative w-full">
                                                <Input
                                                    type={isRevealConfirmPassword ? "text" : "password"}
                                                    placeholder="パスワード"
                                                    {...field}
                                                    className="w-full p-2 border rounded pr-10"
                                                />
                                                <span
                                                    onClick={toggleConfirmPassword}
                                                    role="presentation"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                                >
                                                    {isRevealConfirmPassword ? (
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
                                {isLoading ? "登録中..." : "登録"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-gray-500">
                        すでにアカウントをお持ちですか？{" "}
                        <Button
                            variant="link"
                            onClick={() => navigate("/login")}
                            className="text-blue-500 hover:underline"
                        >
                            ログインはこちら
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}