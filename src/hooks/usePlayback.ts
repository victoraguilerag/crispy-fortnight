import { useState, useCallback, useEffect } from 'react';
import { KEYBOARD_CONTROLS, PLAYBACK_SPEEDS } from '../constants/camera';

export function usePlayback(totalFrames: number) {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    const togglePlayback = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === KEYBOARD_CONTROLS.TOGGLE_PLAYBACK) {
            togglePlayback();
        }
    }, [togglePlayback]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    useEffect(() => {
        let animationFrame: number;

        if (isPlaying) {
            const updateFrame = () => {
                setCurrentFrame(prev => {
                    const next = prev + playbackSpeed;
                    return next >= totalFrames ? 0 : next;
                });
                animationFrame = requestAnimationFrame(updateFrame);
            };
            animationFrame = requestAnimationFrame(updateFrame);
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isPlaying, playbackSpeed, totalFrames]);

    return {
        currentFrame,
        setCurrentFrame,
        isPlaying,
        togglePlayback,
        playbackSpeed,
        setPlaybackSpeed,
    };
} 