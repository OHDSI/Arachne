import { Skeleton as SkeletonUI, SkeletonProps, styled } from '@mui/material';
import React from 'react';

const StyledSkeleton = styled(SkeletonUI)`
  transform: none;
  transform-origin: none;
`;
export const Skeleton: React.FC<SkeletonProps> = props => {
  return <StyledSkeleton {...props} />;
};
