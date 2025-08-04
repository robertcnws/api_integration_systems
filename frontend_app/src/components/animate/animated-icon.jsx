import React from 'react';

import { styled, keyframes } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

const shake = keyframes`
  0% { transform: rotate(15deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
  100% { transform: rotate(5deg); }
`;

const Animated = styled(Iconify)(({ theme, color, width }) => ({
  animation: `${shake} 1s infinite`,
  color: color === 'warning' ? theme.palette.warning.main : theme.palette.error.main, 
  fontSize: '5rem', 
  strokeWidth: 2,
  width: width || '5rem',
}));

const AnimatedIcon = ({icon, color, width}) => <Animated icon={icon} color={color} width={width}/>; 

export default AnimatedIcon;
