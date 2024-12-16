import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Scene from './components/Scene';
import Timeline from './components/Timeline';
import CameraControls from './components/CameraControls';
import { useCamera } from './hooks/useCamera';
import { usePlayback } from './hooks/usePlayback';
import { CAMERA_POSITIONS } from './constants/camera';

export default function App() {
    const {
        controlsRef,
        currentView,
        controlsEnabled,
        handleViewChange,
        toggleControls,
    } = useCamera();

    const {
        currentFrame,
        setCurrentFrame,
        isPlaying,
        togglePlayback,
        playbackSpeed,
        setPlaybackSpeed,
    } = usePlayback(50); // Total frames hardcoded for now, could be made dynamic

    return (
        <>
            <CameraControls
                currentView={currentView}
                onViewChange={handleViewChange}
                controlsEnabled={controlsEnabled}
                onToggleControls={toggleControls}
            />
            <Canvas
                camera={{ position: CAMERA_POSITIONS[currentView].position, fov: 60 }}
                style={{ background: '#111' }}
            >
                <Suspense fallback={null}>
                    <Scene frameIndex={currentFrame} />
                    <OrbitControls
                        ref={controlsRef}
                        makeDefault
                        target={CAMERA_POSITIONS[currentView].target}
                        enabled={controlsEnabled}
                    />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                </Suspense>
            </Canvas>
            <Timeline
                currentFrame={currentFrame}
                setCurrentFrame={setCurrentFrame}
                totalFrames={50}
                isPlaying={isPlaying}
                togglePlayback={togglePlayback}
                playbackSpeed={playbackSpeed}
                setPlaybackSpeed={setPlaybackSpeed}
            />
        </>
    );
} 