const API_BASE_URL = 'http://localhost:8080';

export interface LoginRequest {
    mail_address: string;
    password: string;
}

export interface User {
    id: number;
    mail_address: string;
    username: string;
}

export interface LoginResponse {
    message: string;
    user: User;
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ログインに失敗しました。');
    }
    return response.json().then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }

        sessionStorage.setItem('user', JSON.stringify(data.user));
        return data as LoginResponse;
    });
};

export const logoutUser = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/login';
};

export const getCurrentUser = (): User | null => {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export interface RegisterRequest {
    username: string;
    mail_address: string;
    password: string;
}

export const registerUser = async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登録に失敗しました。');
    }
    return response.json().then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }
        return data as { message: string };
    });
}