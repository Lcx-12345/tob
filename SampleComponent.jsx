/**
 * Sample React JavaScript component
 * Created on: 2026-04-10
 * File format: .jsx
 */

import React, { useState } from 'react';

export function SampleComponent({ title, initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  return (
    <div className="sample-component">
      <h2>{title}</h2>
      <div className="count-display">
        <button onClick={handleDecrement}>-</button>
        <span>{count}</span>
        <button onClick={handleIncrement}>+</button>
      </div>
      <p>This is a sample React JavaScript component.</p>
    </div>
  );
}

export default SampleComponent;