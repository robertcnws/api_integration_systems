// import React from 'react';
// import GaugeChart from 'react-gauge-chart';

// const MatchGauge = ({ percentage }) => {
//   const normalizedPercentage = Math.max(0, Math.min(percentage, 100));
//   const gaugePercentage = normalizedPercentage / 100;

//   const colors = ['#F44336', '#FF9800', '#4CAF50'];

//   return (
//     <div style={{ width: '300px', height: '100%' }}>
//       <GaugeChart
//         id="match-gauge"
//         nrOfLevels={3}
//         colors={colors}
//         arcWidth={0.1}
//         percent={gaugePercentage}
//         needleColor="#345243"
//         textColor="#000000"
//         hideText={false}
//         needleBaseColor="#345243"
//         arcsLength={[0.5, 0.3, 0.2]}
//         arcPadding={0.01}
//         angle={350}
//       />
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{`${normalizedPercentage}%`}</div>
//         <div style={{ fontSize: '16px', color: normalizedPercentage >= 80 ? colors[2] : (normalizedPercentage >= 50 ? colors[1] : colors[0]) }}>
//           {normalizedPercentage >= 80
//             ? 'High'
//             : normalizedPercentage >= 50
//             ? 'Weak'
//             : 'Bad'}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MatchGauge;

import React, { useState, useEffect } from 'react';

// src/MatchGauge.js
import { Box } from '@mui/material';

const MatchGauge = ({ percentage }) => {
    const normalizedPercentage = Math.max(0, Math.min(percentage, 100));
    const [currentPercentage, setCurrentPercentage] = useState(0);

    useEffect(() => {
        setCurrentPercentage(normalizedPercentage);
    }, [normalizedPercentage]);

    const size = 280;
    const strokeWidth = 15;
    const center = size / 2;
    const radius = center - strokeWidth;

    const arcs = [
        { start: 0, end: 50, color: '#F44336' },
        { start: 50, end: 80, color: '#FF9800' },
        { start: 80, end: 100, color: '#4CAF50' },
    ];

    const calculateArcPath = (startPercent, endPercent, color) => {
        const startAngle = (startPercent / 100) * 270 - 225;
        const endAngle = (endPercent / 100) * 270 - 225;

        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

        const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
        const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
        const endX = center + radius * Math.cos((endAngle * Math.PI) / 180);
        const endY = center + radius * Math.sin((endAngle * Math.PI) / 180);

        return (
            <path
                key={`${startPercent}-${endPercent}`}
                d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
            />
        );
    };

    const renderArcs = () => arcs.map(arc => calculateArcPath(arc.start, arc.end, arc.color));

    const renderTicks = () => {
        const ticks = [];
        const tickValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

        tickValues.forEach(value => {
            const angle = (value / 100) * 270 - 225;
            const innerRadius = radius - 10;
            const outerRadius = radius;
            const x1 = center + innerRadius * Math.cos((angle * Math.PI) / 180);
            const y1 = center + innerRadius * Math.sin((angle * Math.PI) / 180);
            const x2 = center + outerRadius * Math.cos((angle * Math.PI) / 180);
            const y2 = center + outerRadius * Math.sin((angle * Math.PI) / 180);

            const labelRadius = radius - 25;
            const labelX = center + labelRadius * Math.cos((angle * Math.PI) / 180);
            const labelY = center + labelRadius * Math.sin((angle * Math.PI) / 180) + 5;

            ticks.push(
                <g key={value}>
                    <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#000"
                        strokeWidth="2"
                    />
                    <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fontSize="14"
                        fill="#000"
                    >
                        {value}
                    </text>
                </g>
            );
        });

        return ticks;
    };

    const calculateNeedleAngle = () =>  (currentPercentage / 100) * 270 - 225;

    const needleAngle = calculateNeedleAngle();

    return (
        <Box
            sx={{
                ml: 5,
                mb: 5,
                textAlign: 'center',
                width: size,
                height: size,
                borderRadius: '50%',
                border: '3px solid #bebebe',
                // bgcolor: 'rgb(230, 230, 230)',
                background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                boxShadow: '10px 10px 20px #bebebe, -10px -10px 20px #ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
        >
            <svg width="100%" height={size + 30} style={{ marginLeft: -6, marginTop: -4 }}>
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#e6e6e6"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {renderArcs()}

                {renderTicks()}

                <g
                    style={{
                        transform: `rotate(${needleAngle + 90}deg)`,
                        transformOrigin: `${center}px ${center}px`,
                        transition: 'transform 1s ease-out',
                    }}
                >
                    <line
                        x1={center}
                        y1={center + 15}
                        x2={center}
                        y2={center - (radius - 30)}
                        stroke="#000"
                        strokeWidth="2"
                    />
                    {/* <polygon
                        points={`0,-${radius - 30} -3,0 3,0`}
                        fill="#000"
                    /> */}
                </g>

                <circle cx={center} cy={center} r="5" fill="#000" />

                <text
                    x={center}
                    y={center + 40}
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="bold"
                >
                    {`${normalizedPercentage}%`}
                </text>

                <text
                    x={center}
                    y={center + 60}
                    textAnchor="middle"
                    fontSize="16"
                    fill={
                        normalizedPercentage >= 80
                            ? '#4CAF50'
                            : normalizedPercentage >= 50
                                ? '#FF9800'
                                : '#F44336'
                    }
                >
                    {normalizedPercentage >= 80
                        ? 'High'
                        : normalizedPercentage >= 50
                            ? 'Weak'
                            : 'Bad'}
                </text>
            </svg>
        </Box>
    );
};

export default MatchGauge;
