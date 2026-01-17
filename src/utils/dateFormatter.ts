
export const formatRelativeTime = ((date: string): string => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInMinutes = Math.floor(
            (now.getTime() - messageDate.getTime()) / (1000 * 60),
        );

        if (diffInMinutes < 1) return 'たった今';
        if (diffInMinutes < 60) return `${diffInMinutes}分前`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}時間前`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}日前`;

        return messageDate.toLocaleDateString();
    }); 
