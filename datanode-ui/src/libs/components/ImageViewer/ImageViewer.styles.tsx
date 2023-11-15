import styled from '@emotion/styled';

export const ImageViewerContainer = styled.div<any>`
  height: 100%;

  .react-viewer-image {
    border: ${({ theme }) => `1px solid ${theme.palette?.secondary.main}`};
  }
  .react-viewer-mask {
    background-color: #fff;
  }
`;
