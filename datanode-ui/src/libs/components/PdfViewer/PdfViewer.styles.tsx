import styled from '@emotion/styled';

export const PdfViewerContainer = styled.div<any>`
  height: 100%;
  overflow: ${props => (props.scroll ? 'auto' : 'hidden')};
  display: flex;
  flex-direction: column;
  position: relative;

  .react-pdf__Document {
    // max-height: ${props => `${props.height}px`};
    /* height: calc(100% - 80px);
    overflow: auto; */
  }
  .react-pdf__Page {
    margin: 10px 0;
  }
  .react-pdf__Page__textContent {
    border: 1px solid darkgrey;
    box-shadow: 5px 5px 5px 1px #ccc;
    border-radius: 5px;
  }

  .react-pdf__Page__canvas {
    margin: 0 auto;
  }
`;
