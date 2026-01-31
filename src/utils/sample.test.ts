// src/utils/sample.test.ts
import { describe, it, expect } from 'vitest';
import { add } from './sample';

describe('add 関数', () => {
    it('2つの数値を足し算できる', () => {
        const result = add(2, 3);
        expect(result).toBe(5);
    });
    it('負の数も扱える', () => {
        const result = add(2, -3);
        expect(result).toBe(-1);
    });
});