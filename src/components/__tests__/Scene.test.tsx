import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Scene from '../Scene';

// Mock Three.js related modules
jest.mock('@react-three/fiber', () => ({
    useFrame: jest.fn(),
    useThree: () => ({
        camera: {},
        scene: {},
        gl: {},
    }),
    Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock Three.js components
jest.mock('@react-three/drei', () => ({
    Points: ({ children }: { children: React.ReactNode }) => (
        <group data-testid="mock-points">{children}</group>
    ),
    Line: ({ points }: { points: any[] }) => (
        <group data-testid="mock-line" />
    ),
    Html: ({ children }: { children: React.ReactNode }) => children,
    BufferGeometry: ({ children }: { children: React.ReactNode }) => (
        <group data-testid="mock-buffer-geometry">{children}</group>
    ),
    BufferAttribute: ({ attach, count, array, itemSize }: any) => (
        <group data-testid="mock-buffer-attribute" />
    ),
    PointsMaterial: (props: any) => (
        <group data-testid="mock-points-material" />
    ),
    Mesh: ({ children }: { children: React.ReactNode }) => (
        <group data-testid="mock-mesh">{children}</group>
    ),
    BoxGeometry: (props: any) => (
        <group data-testid="mock-box-geometry" />
    ),
    MeshPhongMaterial: (props: any) => (
        <group data-testid="mock-mesh-phong-material" />
    ),
}));

// Mock Three.js geometry components
jest.mock('three', () => ({
    Vector3: jest.fn((x, y, z) => ({ x, y, z })),
    Float32Array: Array,
}));

// Mock fetch data
const mockFetchData = {
    points: [
        { x: 1, y: 1, z: 1 },
        { x: 2, y: 2, z: 2 },
    ],
    cuboids: [
        {
            center: { x: 0, y: 0, z: 0 },
            dimensions: { x: 1, y: 1, z: 1 },
            yaw: 0,
            label: "test_cuboid"
        }
    ]
};

describe('Scene Component', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFetchData),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', async () => {
        const { getByText } = render(<Scene frameIndex={0} />);
        expect(getByText('Loading...')).toBeInTheDocument();
    });

    test('fetches and processes data correctly', async () => {
        const { getByTestId } = render(<Scene frameIndex={0} />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('frame_00.json')
            );
        });
    });

    test('handles fetch errors gracefully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
            })
        ) as jest.Mock;

        const { getByText } = render(<Scene frameIndex={0} />);

        await waitFor(() => {
            expect(getByText(/Error:/)).toBeInTheDocument();
        });
    });

    test('updates when frame index changes', async () => {
        const { rerender } = render(<Scene frameIndex={0} />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('frame_00.json')
            );
        });

        rerender(<Scene frameIndex={1} />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('frame_01.json')
            );
        });
    });
}); 