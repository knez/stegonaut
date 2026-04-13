import { describe, it, beforeEach, expect } from 'vitest';
import { readFileSync } from 'fs';
import { MP3Stego } from '../src/static/app/mp3stego.js';
import { encodeUTF8, decodeUTF8 } from '../src/static/app/helpers.js';

function loadMp3() {
    const data = readFileSync('test/short.mp3');
    return new MP3Stego('short.mp3', new Uint8Array(data).buffer);
}

describe('MP3Stego', () => {
    let mp3;

    beforeEach(() => {
        mp3 = loadMp3();
    });

    it('isModified() returns false on fresh MP3', () => {
        expect(mp3.isModified()).toBe(false);
    });

    it('spaceLeft() returns a positive number', () => {
        expect(mp3.spaceLeft()).toBeGreaterThan(0);
    });

    it('embedText() marks file as modified', () => {
        mp3.embedText(encodeUTF8('ALOHA'));
        expect(mp3.isModified()).toBe(true);
    });

    it('roundtrip: embed then extract returns original message', () => {
        const msg = 'ALOHA';
        mp3.embedText(encodeUTF8(msg));
        expect(decodeUTF8(mp3.extractText())).toBe(msg);
    });

    it('roundtrip: handles special characters and emoji', () => {
        const msg = 'Héllo wörld! 🎉';
        mp3.embedText(encodeUTF8(msg));
        expect(decodeUTF8(mp3.extractText())).toBe(msg);
    });

    it('roundtrip: handles empty string', () => {
        mp3.embedText(encodeUTF8(''));
        expect(decodeUTF8(mp3.extractText())).toBe('');
    });

    it('roundtrip: handles max-length message', () => {
        const space = mp3.spaceLeft();
        const msg = 'A'.repeat(space);
        mp3.embedText(encodeUTF8(msg));
        expect(decodeUTF8(mp3.extractText())).toBe(msg);
    });
});
