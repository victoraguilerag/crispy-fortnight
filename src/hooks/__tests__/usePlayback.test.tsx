import { renderHook, act } from '@testing-library/react';
import usePlayback from '../usePlayback';

describe('usePlayback Hook', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // Mock requestAnimationFrame
        global.requestAnimationFrame = jest.fn(cb => {
            setTimeout(cb, 16); // Roughly 60fps
            return Math.random(); // Return a unique ID
        });
        global.cancelAnimationFrame = jest.fn();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('initializes with correct default values', () => {
        const { result } = renderHook(() => usePlayback(100));
        
        expect(result.current.currentFrame).toBe(0);
        expect(result.current.isPlaying).toBe(false);
        expect(result.current.playbackSpeed).toBe(1);
    });

    test('toggles playback state', () => {
        const { result } = renderHook(() => usePlayback(100));
        
        act(() => {
            result.current.togglePlayback();
        });
        
        expect(result.current.isPlaying).toBe(true);
        
        act(() => {
            result.current.togglePlayback();
        });
        
        expect(result.current.isPlaying).toBe(false);
    });

    test('updates frame during playback', () => {
        const { result } = renderHook(() => usePlayback(100));
        
        act(() => {
            result.current.togglePlayback();
        });

        // Advance timers to trigger animation frame
        act(() => {
            jest.advanceTimersByTime(16);
        });

        expect(result.current.currentFrame).toBeGreaterThan(0);
    });

    test('wraps around to beginning when reaching total frames', () => {
        const totalFrames = 10;
        const { result } = renderHook(() => usePlayback(totalFrames));
        
        act(() => {
            result.current.setCurrentFrame(9);
            result.current.togglePlayback();
        });

        // Advance timers to trigger animation frame
        act(() => {
            jest.advanceTimersByTime(16);
        });

        expect(result.current.currentFrame).toBe(0);
    });

    test('changes playback speed', () => {
        const { result } = renderHook(() => usePlayback(100));
        
        act(() => {
            result.current.setPlaybackSpeed(2);
            result.current.togglePlayback();
        });

        // Advance timers to trigger animation frame
        act(() => {
            jest.advanceTimersByTime(16);
        });

        expect(result.current.currentFrame).toBeGreaterThanOrEqual(2);
    });

    test('cancels animation frame on unmount', () => {
        const { unmount } = renderHook(() => usePlayback(100));
        
        unmount();
        
        expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    test('cancels animation frame when stopping playback', () => {
        const { result } = renderHook(() => usePlayback(100));
        
        act(() => {
            result.current.togglePlayback(); // Start playback
            result.current.togglePlayback(); // Stop playback
        });
        
        expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });
}); 