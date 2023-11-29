import styled from '@emotion/styled';

export const FileListContainer = styled.div<any>`
  box-shadow: ${props =>
    props.subList
      ? '2px 0px 4px -3px transparent;'
      : '2px 0px 4px -3px transparent'};
  max-height: ${props =>
    props.subList ? 'auto' : 'calc(100vh - 250px)'}; // not good
  overflow: hidden;
  overflow-y: auto;
  border-left: ${props =>
    props.subList ? '1px solid #232323' : '0px solid #232323'};
  z-index: 2;
  section {
    height: calc(100vh - 250px);
  }
`;

export const FileItemContainer = styled.div<any>`
  padding: 5px 10px;
  display: flex;
`;

export const FileListSubContainer = styled.div`
  margin-left: 15px;
`;

export const FileItemLine = styled.div`
  width: 5px;
  height: 1px;
  border-bottom: 1px solid #343434;
  position: relative;
  top: 17px;
`;
export const FileNameContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
export const FileName = styled.div<any>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: ${props => (props.selectedFile ? '600' : '300')};
  margin-top: 2px;
  margin-left: 7px;
  margin-right: 7px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const FileSize = styled.span`
  font-weight: 600;
  font-size: 10px;
`;

export const FileChildrenCount = styled.div`
  padding: 0px 7px 0px;
  font-size: 11px;
  background: #28393a;
  color: #ffffff;
  /* width: 18px; */
  /* height: 16px; */
  text-align: center;
  border-radius: 4px;
  padding-top: 2px;
  margin-top: 6px;
  position: relative;
  top: -4px;
`;

export const FileItemIcon = styled.div``;

export const HeaderFileReader = styled.div`
  background: #28393a;
  color: #ffffff;
  padding: 10px 10px;
`;

export const HeaderTitle = styled.div<any>`
  display: inline-block;
  position: relative;
  top: 2px;
  margin-left: ${props => props.marginLeft};
`;

export const DowloadLink = styled.div`
  display: unline-block;
  float: right;
`;
