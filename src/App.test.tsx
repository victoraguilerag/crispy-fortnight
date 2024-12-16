import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock functions for OrbitControls
const mockPositionSet = jest.fn();
const mockTargetSet = jest.fn();

// Mock object structure
const mockObject = {
    position: {
        set: mockPositionSet,
    },
};

const mockTarget = {
    set: mockTargetSet,
};

// Mock modules
jest.mock('@react-three/fiber', () => ({
    Canvas: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-canvas">{children}</div>
    ),
}));

jest.mock('@react-three/drei', () => ({
    OrbitControls: React.forwardRef((props: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
            object: mockObject,
            target: mockTarget,
        }));
        return <div data-testid="mock-orbit-controls" {...props} />;
    }),
}));

jest.mock('./components/Scene', () => () => (
    <div data-testid="mock-scene">Scene</div>
));

jest.mock('./components/Timeline', () => ({
    __esModule: true,
    default: ({ currentFrame, totalFrames, isPlaying }: any) => (
        <div data-testid="mock-timeline">
            Timeline: {currentFrame}/{totalFrames} {isPlaying ? '(Playing)' : '(Paused)'}
        </div>
    ),
}));

describe('App Component', () => {
    beforeEach(() => {
        mockPositionSet.mockClear();
        mockTargetSet.mockClear();
    });

    test('renders all major components', () => {
        render(<App />);
        
        expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
        expect(screen.getByTestId('mock-scene')).toBeInTheDocument();
        expect(screen.getByTestId('mock-timeline')).toBeInTheDocument();
        expect(screen.getByTestId('mock-orbit-controls')).toBeInTheDocument();
    });

    test('renders camera position buttons with correct ARIA attributes', () => {
        render(<App />);
        
        const defaultView = screen.getByRole('button', { name: 'Default View' });
        expect(defaultView).toBeInTheDocument();
        expect(defaultView).toHaveAttribute('aria-pressed', 'true');
        
        const views = ['Top', 'Side', 'Front', 'Isometric', 'Closeup'];
        views.forEach(view => {
            const button = screen.getByRole('button', { name: `${view} View` });
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-pressed', 'false');
        });
    });

    test('handles camera control toggle with correct ARIA states', () => {
        render(<App />);
        
        const toggleButton = screen.getByRole('button', { name: 'Lock Camera' });
        expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
        
        fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: 'Unlock Camera' }))
            .toHaveAttribute('aria-pressed', 'true');
        
        fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: 'Lock Camera' }))
            .toHaveAttribute('aria-pressed', 'false');
    });

    test('renders controls help panel with proper ARIA roles', () => {
        render(<App />);
        
        const helpPanel = screen.getByRole('complementary', { name: 'Camera controls help' });
        expect(helpPanel).toBeInTheDocument();
        expect(screen.getByText('Camera Controls:')).toBeInTheDocument();
        expect(screen.getByText('WASD - Move camera')).toBeInTheDocument();
        expect(screen.getByText('QE - Up/Down')).toBeInTheDocument();
        expect(screen.getByText('Arrow Keys - Rotate')).toBeInTheDocument();
        expect(screen.getByText('Z/X - Zoom in/out')).toBeInTheDocument();
        expect(screen.getByText('Mouse - Orbit (when unlocked)')).toBeInTheDocument();
    });

    test('changes view when camera position buttons are clicked', () => {
        render(<App />);
        
        const topViewButton = screen.getByRole('button', { name: 'Top View' });
        fireEvent.click(topViewButton);
        expect(topViewButton).toHaveAttribute('aria-pressed', 'true');
        expect(mockPositionSet).toHaveBeenCalledWith(0, 20, 0);
        expect(mockTargetSet).toHaveBeenCalledWith(0, 0, 0);
        
        const sideViewButton = screen.getByRole('button', { name: 'Side View' });
        fireEvent.click(sideViewButton);
        expect(sideViewButton).toHaveAttribute('aria-pressed', 'true');
        expect(topViewButton).toHaveAttribute('aria-pressed', 'false');
        expect(mockPositionSet).toHaveBeenCalledWith(20, 0, 0);
        expect(mockTargetSet).toHaveBeenCalledWith(0, 0, 0);
    });

    test('handles playback controls', () => {
        render(<App />);
        
        // Simulate spacebar press to toggle playback
        fireEvent.keyDown(document, { key: ' ' });
        expect(screen.getByTestId('mock-timeline')).toHaveTextContent('(Playing)');
        
        fireEvent.keyDown(document, { key: ' ' });
        expect(screen.getByTestId('mock-timeline')).toHaveTextContent('(Paused)');
    });
}); 