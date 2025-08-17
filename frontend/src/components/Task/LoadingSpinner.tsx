interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => (
    <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">{message}</p>
    </div>
);

interface ErrorMessageProps {
    error: string;
    onRetry?: () => void;
}

export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => (
    <div className="text-red-500 text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">エラーが発生しました</h3>
            <p className="mb-4">{error}</p>
            {onRetry && (
                <button 
                    onClick={onRetry}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    再試行
                </button>
            )}
        </div>
    </div>
);
