import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from '../Timeline';

describe('Timeline Component', () => {
    const mockSetCurrentFrame = jest.fn((frame: number | ((prev: number) => number)) => {
        if (typeof frame === 'function') {
            return frame(0); // Mock the state updater function
        }
        return frame;
    });

    const mockTogglePlayback = jest.fn();
    const mockSetPlaybackSpeed = jest.fn();

    const defaultProps = {
        currentFrame: 0,
        setCurrentFrame: mockSetCurrentFrame,
        totalFrames: 50,
        isPlaying: false,
        togglePlayback: mockTogglePlayback,
        playbackSpeed: 1,
        setPlaybackSpeed: mockSetPlaybackSpeed,
    };

    beforeEach(() => {
        jest.useFakeTimers();
        mockSetCurrentFrame.mockClear();
        mockTogglePlayback.mockClear();
        mockSetPlaybackSpeed.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('renders with initial state', () => {
        render(<Timeline {...defaultProps} />);
        
        expect(screen.getByText('Frame: 1 / 50')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '▶' })).toBeInTheDocument();
        expect(screen.getByRole('slider')).toHaveValue('0');
    });

    test('handles play/pause toggle', () => {
        render(<Timeline {...defaultProps} />);
        
        const playButton = screen.getByRole('button', { name: '▶' });
        fireEvent.click(playButton);
        
        expect(mockTogglePlayback).toHaveBeenCalled();
    });

    test('handles speed changes', () => {
        render(<Timeline {...defaultProps} />);
        
        fireEvent.click(screen.getByRole('button', { name: '2x' }));
        expect(mockSetPlaybackSpeed).toHaveBeenCalledWith(2);
    });

    test('handles frame navigation buttons', () => {
        render(<Timeline {...defaultProps} />);
        
        // Test skip to end
        fireEvent.click(screen.getByRole('button', { name: '⏭' }));
        expect(mockSetCurrentFrame).toHaveBeenCalledWith(49); // totalFrames - 1
        
        // Test skip to start
        fireEvent.click(screen.getByRole('button', { name: '⏮' }));
        expect(mockSetCurrentFrame).toHaveBeenCalledWith(0);
    });

    test('handles keyboard controls', () => {
        render(<Timeline {...defaultProps} />);
        
        // Test spacebar for play/pause
        fireEvent.keyDown(document, { key: ' ' });
        expect(mockTogglePlayback).toHaveBeenCalled();
        
        // Test arrow keys for frame navigation
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        expect(mockSetCurrentFrame).toHaveBeenCalledWith(1);
        
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
        expect(mockSetCurrentFrame).toHaveBeenCalledWith(0);
    });

    test('stops at the end of frames', () => {
        const props = {
            ...defaultProps,
            currentFrame: 49,
        };
        render(<Timeline {...props} />);
        
        fireEvent.click(screen.getByRole('button', { name: '▶' }));
        expect(mockTogglePlayback).toHaveBeenCalled();
    });

    test('handles slider input', () => {
        render(<Timeline {...defaultProps} />);
        
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '25' } });
        
        expect(mockSetCurrentFrame).toHaveBeenCalledWith(25);
    });
}); 