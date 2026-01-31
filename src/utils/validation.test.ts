// src/utils/validator.test.ts
import { describe, it, expect } from 'vitest';
import { validateMessage } from './validation'

describe.skip('validateMessage', () => {
    it('空文字の場合はエラーを返す', () => {
    expect(validateMessage('')).toBe('内容を入力してください');
    });

    it('141文字以上はエラー', () => {
    const text = 'a'.repeat(141);
    expect(validateMessage(text)).toContain('140');
    });

    it('正常な入力の場合は空文字を返す', () => {
    expect(validateMessage('こんにちは')).toBe('');
    });
});
