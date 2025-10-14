// src/components/StatsCard.jsx

import React from 'react';

export const StatsCard = ({ label, value, unit }) => {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg text-center transform transition-transform hover:-translate-y-1">
      <p className="text-neutral-400 text-sm uppercase tracking-wider">{label}</p>
      <p className="text-4xl font-bold text-red-400 mt-2">
        {value}
        {unit && <span className="text-2xl ml-1">{unit}</span>}
      </p>
    </div>
  );
};