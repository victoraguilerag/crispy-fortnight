import React, { memo } from 'react';
import { CameraView } from '../types';
import { CAMERA_POSITIONS } from '../constants/camera';

interface CameraControlsProps {
    currentView: CameraView;
    onViewChange: (view: CameraView) => void;
    controlsEnabled: boolean;
    onToggleControls: () => void;
}

const formatViewName = (view: CameraView): string => {
    return view.charAt(0).toUpperCase() + view.slice(1);
};

function CameraControls({
    currentView,
    onViewChange,
    controlsEnabled,
    onToggleControls,
}: CameraControlsProps) {
    return (
        <>
            <div className="view-controls" role="group" aria-label="Camera view controls">
                {(Object.keys(CAMERA_POSITIONS) as CameraView[]).map((view) => (
                    <button
                        key={view}
                        onClick={() => onViewChange(view)}
                        className={`view-button ${currentView === view ? 'active' : ''}`}
                        aria-pressed={currentView === view}
                    >
                        {formatViewName(view)} View
                    </button>
                ))}
                <button
                    onClick={onToggleControls}
                    className={`view-button ${!controlsEnabled ? 'active' : ''}`}
                    aria-pressed={!controlsEnabled}
                >
                    {controlsEnabled ? 'Lock Camera' : 'Unlock Camera'}
                </button>
            </div>
            <div className="controls-help" role="complementary" aria-label="Camera controls help">
                <h3>Camera Controls:</h3>
                <p>WASD - Move camera</p>
                <p>QE - Up/Down</p>
                <p>Arrow Keys - Rotate</p>
                <p>Z/X - Zoom in/out</p>
                <p>Mouse - Orbit (when unlocked)</p>
            </div>
        </>
    );
}

export default memo(CameraControls); 