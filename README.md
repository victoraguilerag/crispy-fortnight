# 3D Scene Visualization App

A React-based 3D visualization application for viewing and interacting with point cloud data and cuboid annotations. Built with React Three Fiber and TypeScript.

## Features

### 3D Visualization
- Point cloud visualization with height-based coloring
- Cuboid annotations with labels and dimensions
- Interactive tooltips showing cuboid details
- Dynamic lighting and shadows

### Camera Controls
- Multiple predefined camera positions:
  - Default View
  - Top View
  - Side View
  - Front View
  - Isometric View
  - Closeup View
- Keyboard navigation:
  - WASD - Move camera forward/backward/left/right
  - QE - Move camera up/down
  - Arrow Keys - Rotate camera
  - Z/X - Zoom in/out
- Mouse controls:
  - Left click + drag - Orbit
  - Right click + drag - Pan
  - Scroll - Zoom
- Camera lock/unlock toggle

### Animation Controls
- Frame-by-frame navigation
- Play/Pause animation (Space bar)
- Skip to start/end
- Adjustable playback speeds:
  - 0.5x
  - 1x
  - 2x
  - 4x
- Interactive timeline slider
- Frame counter

## Technical Details

### Dependencies
- React 18
- Three.js
- React Three Fiber
- React Three Drei
- TypeScript
- Parcel (bundler)

### Project Structure
```
src/
├── components/
│   ├── Scene.tsx      # Main 3D scene component
│   └── Timeline.tsx   # Animation control component
├── App.tsx           # Main application component
├── index.tsx         # Application entry point
└── styles.css        # Global styles
```

### Data Format
The application expects JSON data in the following format:
```json
{
  "points": [
    { "x": number, "y": number, "z": number }
  ],
  "cuboids": [
    {
      "center": { "x": number, "y": number, "z": number },
      "dimensions": { "x": number, "y": number, "z": number },
      "yaw": number,
      "label": string
    }
  ]
}
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Usage Tips

### Camera Controls
- Use predefined views for quick navigation to common viewpoints
- Combine keyboard and mouse controls for precise camera positioning
- Lock camera when needed to prevent accidental movement

### Animation Playback
- Use spacebar to quickly toggle play/pause
- Adjust playback speed based on scene complexity
- Use the timeline slider for quick navigation to specific frames

### Performance
- The application automatically handles frame caching
- Point cloud rendering is optimized for performance
- Tooltips and labels are rendered only when hovering

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License
MIT License

## Testing

The project uses Jest and React Testing Library for unit testing. To run the tests:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode (useful during development)
npm test -- --watch

# Run a specific test file
npm test -- path/to/test/file.test.tsx
```

### Test Structure

The tests are organized in the following way:
- Component tests are located in `src/components/__tests__/`
- Hook tests are located in `src/hooks/__tests__/`
- Each test file follows the naming convention: `*.test.tsx`

### Test Coverage

The test suite covers:
- Component rendering
- User interactions
- Data fetching
- Error handling
- State management
- Custom hooks behavior

To view a detailed coverage report, run the tests with the `--coverage` flag.
