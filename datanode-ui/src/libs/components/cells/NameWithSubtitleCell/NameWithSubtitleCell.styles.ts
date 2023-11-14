import styled from '@emotion/styled';

export const NameWrapper = styled('div')(({ theme }: any) => ({
  fontWeight: 600,
}));

export const SubtitleWrapper = styled('div')(({ theme }: any) => ({
  color: theme.palette.textColor.label,
  fontSize: 12,
}));
