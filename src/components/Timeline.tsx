import React, { useEffect } from 'react';
import { TimelineProps } from '../types';

export default function Timeline({
    currentFrame,
    setCurrentFrame,
    totalFrames,
    isPlaying,
    togglePlayback,
    playbackSpeed,
    setPlaybackSpeed
}: TimelineProps) {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setCurrentFrame(Math.max(0, currentFrame - 1));
            } else if (e.key === 'ArrowRight') {
                setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1));
            } else if (e.key === ' ') {  // Spacebar
                e.preventDefault();
                togglePlayback();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentFrame, setCurrentFrame, totalFrames, togglePlayback]);

    return (
        <div className="timeline">
            <div className="timeline-controls">
                <button
                    onClick={togglePlayback}
                    className="control-button"
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                    onClick={() => setCurrentFrame(0)}
                    className="control-button"
                >
                    ⏮
                </button>
                <button
                    onClick={() => setCurrentFrame(totalFrames - 1)}
                    className="control-button"
                >
                    ⏭
                </button>
                <div className="speed-controls">
                    {[0.5, 1, 2, 4].map(speed => (
                        <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`speed-button ${playbackSpeed === speed ? 'active' : ''}`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            </div>
            <input
                type="range"
                min={0}
                max={totalFrames - 1}
                value={currentFrame}
                onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                style={{ width: '300px' }}
            />
            <div className="timeline-info">
                Frame: {currentFrame + 1} / {totalFrames}
            </div>
        </div>
    );
} 