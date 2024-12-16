import { CameraPosition, CameraView } from '../types';

export const CAMERA_POSITIONS: Record<CameraView, CameraPosition> = {
    default: { position: [10, 10, 10], target: [0, 0, 0] },
    top: { position: [0, 20, 0], target: [0, 0, 0] },
    side: { position: [20, 0, 0], target: [0, 0, 0] },
    front: { position: [0, 0, 20], target: [0, 0, 0] },
    isometric: { position: [15, 15, 15], target: [0, 0, 0] },
    closeup: { position: [5, 5, 5], target: [0, 0, 0] },
};

export const PLAYBACK_SPEEDS = [0.5, 1, 2, 4];

export const KEYBOARD_CONTROLS = {
    MOVE_FORWARD: 'w',
    MOVE_BACKWARD: 's',
    MOVE_LEFT: 'a',
    MOVE_RIGHT: 'd',
    MOVE_UP: 'q',
    MOVE_DOWN: 'e',
    ZOOM_IN: 'z',
    ZOOM_OUT: 'x',
    TOGGLE_PLAYBACK: ' ', // spacebar
} as const; 