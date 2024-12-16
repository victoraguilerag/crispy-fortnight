import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Point {
    x: number;
    y: number;
    z: number;
}

interface Cuboid {
    center: Point;
    size: Point;
    orientation: { z: number };
    label: string;
}

interface SceneData {
    points: Point[];
    cuboids: Cuboid[];
}

interface SceneProps {
    frameIndex: number;
}

export default function Scene({ frameIndex }: SceneProps) {
    const [sceneData, setSceneData] = useState<SceneData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const pointsRef = useRef<THREE.Points>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://static.scale.com/uploads/pandaset-challenge/frame_${String(frameIndex).padStart(2, '0')}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Raw API response:', data);

                // Transform and validate points data
                const validPoints = (data.points || []).filter((point: any) => {
                    return (
                        point &&
                        typeof point.x === 'number' && !isNaN(point.x) &&
                        typeof point.y === 'number' && !isNaN(point.y) &&
                        typeof point.z === 'number' && !isNaN(point.z)
                    );
                });

                // Transform and validate cuboids data
                const validCuboids = (data.cuboids || []).map((cuboid: any) => ({
                    center: {
                        x: Number(cuboid.center?.x || 0),
                        y: Number(cuboid.center?.y || 0),
                        z: Number(cuboid.center?.z || 0)
                    },
                    size: {
                        x: Math.abs(Number(cuboid.dimensions?.x || 1)),
                        y: Math.abs(Number(cuboid.dimensions?.y || 1)),
                        z: Math.abs(Number(cuboid.dimensions?.z || 1))
                    },
                    orientation: {
                        z: Number(cuboid.yaw || 0)
                    },
                    label: String(cuboid.label || 'Unknown')
                }));

                const transformedData = {
                    points: validPoints,
                    cuboids: validCuboids
                };

                setSceneData(transformedData);
                setError(null);
            } catch (error) {
                console.error('Error fetching scene data:', error);
                setError(error instanceof Error ? error.message : 'Failed to load scene data');
                setSceneData(null);
            }
        };
        fetchData();
    }, [frameIndex]);

    if (error) {
        return (
            <Html center>
                <div style={{ color: 'red', background: 'rgba(0,0,0,0.7)', padding: '10px' }}>
                    Error: {error}
                </div>
            </Html>
        );
    }

    if (!sceneData || !sceneData.points || !sceneData.cuboids) {
        return (
            <Html center>
                <div style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px' }}>
                    Loading...
                </div>
            </Html>
        );
    }

    // Create points geometry
    const pointsPositions = new Float32Array(sceneData.points.length * 3);
    const pointsColors = new Float32Array(sceneData.points.length * 3);

    // Find min and max Z values for better color mapping
    const zValues = sceneData.points.map(p => p.z);
    const minZ = Math.min(...zValues);
    const maxZ = Math.max(...zValues);
    const zRange = maxZ - minZ;

    sceneData.points.forEach((point, i) => {
        pointsPositions[i * 3] = point.x;
        pointsPositions[i * 3 + 1] = point.y;
        pointsPositions[i * 3 + 2] = point.z;

        // Improved color mapping based on actual height range
        const normalizedHeight = (point.z - minZ) / (zRange || 1);
        pointsColors[i * 3] = Math.min(1, normalizedHeight);
        pointsColors[i * 3 + 1] = Math.min(1, 1 - normalizedHeight);
        pointsColors[i * 3 + 2] = 0.5;
    });

    return (
        <group>
            {/* Points */}
            <Points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={pointsPositions.length / 3}
                        array={pointsPositions}
                        itemSize={3}
                        normalized={false}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={pointsColors.length / 3}
                        array={pointsColors}
                        itemSize={3}
                        normalized={false}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation={true}
                />
            </Points>

            {/* Cuboids */}
            {sceneData.cuboids.map((cuboid, index) => (
                <Cuboid key={index} {...cuboid} />
            ))}
        </group>
    );
}

function Cuboid({ center, size, orientation, label }: Cuboid) {
    const [hovered, setHovered] = useState(false);

    // Validate cuboid data
    if (!center || !size || !orientation || typeof orientation.z !== 'number') {
        console.error('Invalid cuboid data:', { center, size, orientation, label });
        return null;
    }

    const vertices = [
        [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5],
        [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]
    ].map(([x, y, z]) => new THREE.Vector3(
        x * size.x,
        y * size.y,
        z * size.z
    ));

    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    return (
        <group
            position={[center.x, center.y, center.z]}
            rotation={[0, 0, orientation.z]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <mesh>
                <boxGeometry args={[size.x, size.y, size.z]} />
                <meshPhongMaterial
                    color={hovered ? "#ff9900" : "#666666"}
                    transparent
                    opacity={0.2}
                />
            </mesh>

            {edges.map((edge, i) => (
                <Line
                    key={i}
                    points={[vertices[edge[0]], vertices[edge[1]]]}
                    color={hovered ? "#ff9900" : "#ffffff"}
                    lineWidth={1}
                />
            ))}

            {hovered && (
                <Html>
                    <div className="tooltip">
                        {label}<br />
                        Size: {size.x.toFixed(2)} x {size.y.toFixed(2)} x {size.z.toFixed(2)}
                    </div>
                </Html>
            )}
        </group>
    );
} 