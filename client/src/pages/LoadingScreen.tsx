import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LOGO_URL } from '../api/api';
import Image from '../components/Image';
import { Box } from '../Jet';


const LogoAnim = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const LogoStyle = styled(Image)`
  animation: ${LogoAnim} 1.5s infinite;
`;

const StatusStyle = styled.h1`
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
`;

const LoadingScreen = ({ status }: { status: string }) => {
  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
      <StatusStyle>{status}</StatusStyle>

      <LogoStyle src={LOGO_URL} alt="Zentrix" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
    </Box>
  );
}

export default LoadingScreen;
