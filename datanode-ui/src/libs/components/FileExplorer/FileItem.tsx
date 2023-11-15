import React, { useState } from 'react';
import {
  FileChildrenCount,
  FileItemContainer,
  FileItemIcon,
  FileItemLine,
  FileListSubContainer,
  FileName,
  FileSize,
} from './FileExplorer.styles';
import { FileList } from './FileList';
import { formatBytes } from '../../utils/formatBytes';
import { Icon } from '../Icon/Icon';
import { UseFileExplorerStatus } from '../../hooks/useFileExplorer';
import { Spinner } from '../Spinner';


export const FileItem: React.FC<any> = props => {
  const { item, selectFile, selectedFile, status, files, subList } = props;
  const [isOpenFolder, setIsOpenFolder] = useState(false);

  const onClickFileItem = item => {
    if (item.__type__ === 'FOLDER') {
      setIsOpenFolder(prevState => !prevState);
    }
    if (item.__type__ === 'FILE') {
      selectFile(item);
    }
  };

  const titleFileItem = (file: any) => {
    const bytes = formatBytes(0, 2);

    return file.__type__ === 'FILE'
      ? `${item.__name__} (${bytes})`
      : `${item.__name__}`;
  };
  // fix to avoid failure
  if (!item) return <></>;
  return (
    <>
      {subList && <FileItemLine />}
      <FileItemContainer
        title={titleFileItem(item)}
        onClick={() => onClickFileItem(item)}
      >
        {item.__type__ === 'FOLDER' && (
          <>
            <FileItemIcon>
              <Icon
                iconName="folder"
                sx={{ '&.MuiSvgIcon-root': { fontSize: 20 } }}
              />
            </FileItemIcon>
            <FileName
              selectedFile={
                item.__name__ && selectedFile && selectedFile.__name__ === item.__name__
              }
            >
              {item.__name__}
            </FileName>
            <FileChildrenCount>{item.__size__}</FileChildrenCount>
          </>
        )}
        {item.__type__ === 'FILE' && (
          <>
            {selectedFile?.__name__ === item.__name__ &&
              status === UseFileExplorerStatus.LOADING_FILE ? (
              <Spinner size={18} />
            ) : (
              <Icon
                iconName={item.ext}
                sx={{ '&.MuiSvgIcon-root': { fontSize: 20 } }}
              />
            )}
            <FileName selectedFile={item.__name__ && selectedFile?.__name__ === item.__name__}>
              {item.__name__}{' '}
              <FileSize>
                {' (' + formatBytes(0, 2) + ')'}
              </FileSize>
            </FileName>
          </>
        )}
      </FileItemContainer>
      {isOpenFolder && (
        <FileListSubContainer>
          <FileList
            subList={true}
            // files={files}
            // filesList={item.children}
            fileTree={item}
            selectedFile={selectedFile}
            selectFile={selectFile}
            status={status}
          />
        </FileListSubContainer>
      )}
    </>
  );
};
