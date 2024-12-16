export interface Point {
    x: number;
    y: number;
    z: number;
}

export interface Cuboid {
    center: Point;
    size: Point;
    orientation: { z: number };
    label: string;
}

export interface SceneData {
    points: Point[];
    cuboids: Cuboid[];
} 