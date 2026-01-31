// src/utils/validator.ts
const MAX_MESSAGE_LENGTH = 140;

export const validateMessage = (str: string): string => {
    if (!str.trim()) {
    return '内容を入力してください';
    }
    if (str.length > MAX_MESSAGE_LENGTH) {
    return `${MAX_MESSAGE_LENGTH} 文字以内で入力`;
    }
    return '';
};