import React from 'react';

const ShapePuzzle = ({ problem }) => {
  const { shapes, width, height } = problem;

  return (
    <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {shapes.map((shape, index) => {
          if (shape.type === 'polygon') {
            return (
              <polygon
                key={index}
                points={shape.points}
                className={shape.className}
              />
            );
          }
          if (shape.type === 'rect') {
            return (
              <rect
                key={index}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                className={shape.className}
              />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

export default ShapePuzzle;