export interface Point {
    x: number;
    y: number;
    z: number;
}

export interface Cuboid {
    center: Point;
    dimensions: Point;
    yaw: number;
    label: string;
}

export interface SceneData {
    points: Point[];
    cuboids: Cuboid[];
}

export type CameraPosition = {
    position: [number, number, number];
    target: [number, number, number];
};

export type CameraView = 'default' | 'top' | 'side' | 'front' | 'isometric' | 'closeup';

export interface TimelineProps {
    currentFrame: number;
    setCurrentFrame: (frame: number) => void;
    totalFrames: number;
    isPlaying: boolean;
    togglePlayback: () => void;
    playbackSpeed: number;
    setPlaybackSpeed: (speed: number) => void;
}

export interface SceneProps {
    frameIndex: number;
    data?: SceneData;
} 