import styled from '@emotion/styled';

export const Content = styled.div`
  padding: 16px;
`;

export const FormElementContainer: any = styled.div`
  font-size: 13px;
  label {
    color: ${({ theme }: any) => theme.palette?.textColor.header};
    font-weight: 700;
    display: ${({ inline }: any) => (inline ? 'inline-block' : 'block')};
    /* font-size: 12px; */
    margin-bottom: 5px;
  }
  .required {
    color: ${({ theme }: any) => theme.palette?.error.main};
  }
  p {
    margin: 0;
    margin-top: 2px;
    font-size: 12px;
    color: ${({ theme }: any) => theme.palette?.textColor.secondary};
  }
  color: ${({ theme }: any) => theme.palette?.textColor.secondary};
`;

export const FormActionsContainer = styled.div`
  text-align: right;
  button:last-child {
    margin-left: 10px;
  }
`;

export const BaseFormUpdateTitle = styled.div`
  margin-bottom: 10px;
  h5 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: #626262;
  }
`;
