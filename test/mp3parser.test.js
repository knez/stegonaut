import { describe, it, beforeEach, expect } from 'vitest';
import { readFileSync } from 'fs';
import { MP3Parser } from '../src/static/app/mp3parser.js';

describe('MP3Parser', () => {
    let mp3;

    beforeEach(() => {
        const data = readFileSync('test/short.mp3');
        const arrayBuffer = new Uint8Array(data).buffer;
        mp3 = new MP3Parser(arrayBuffer);
    });

    it('should skip ID3v2 tags and return correct first frame header', () => {
        expect(Array.from(mp3.getFrameHeader())).toEqual([144, 192]);
    });

    it('hasNext() should return true', () => {
        expect(mp3.hasNext()).toBe(true);
    });

    it('nextFrame() should advance to next frame', () => {
        mp3.nextFrame();
        expect(Array.from(mp3.getFrameHeader())).toEqual([146, 192]);
    });

    it('setFrameHeader() should update frame bytes', () => {
        mp3.setFrameHeader([255, 255]);
        expect(Array.from(mp3.getFrameHeader())).toEqual([255, 255]);
    });

    it('seekStart() should return to first frame', () => {
        mp3.nextFrame();
        mp3.seekStart();
        expect(Array.from(mp3.getFrameHeader())).toEqual([144, 192]);
    });

    it('should not have a next frame after iterating all frames', () => {
        while (mp3.hasNext()) mp3.nextFrame();
        expect(mp3.hasNext()).toBe(false);
    });
});
