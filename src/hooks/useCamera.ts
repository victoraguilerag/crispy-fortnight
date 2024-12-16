import { useRef, useState, useCallback } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraView } from '../types';
import { CAMERA_POSITIONS } from '../constants/camera';

export function useCamera() {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const [currentView, setCurrentView] = useState<CameraView>('default');
    const [controlsEnabled, setControlsEnabled] = useState(true);

    const handleViewChange = useCallback((view: CameraView) => {
        setCurrentView(view);
        if (controlsRef.current) {
            const { position, target } = CAMERA_POSITIONS[view];
            controlsRef.current.object.position.set(...position);
            controlsRef.current.target.set(...target);
        }
    }, []);

    const toggleControls = useCallback(() => {
        setControlsEnabled(prev => !prev);
    }, []);

    return {
        controlsRef,
        currentView,
        controlsEnabled,
        handleViewChange,
        toggleControls,
    };
} 