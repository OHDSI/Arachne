import { AntivirusFileStatus } from '../../enums/AntivirusFileStatus';
import { FileExplorerTypes } from './useFileExplorer.enum';
import { FileExtension } from '../../enums/FileExtension';

interface FileExplorerElement {
  id: string;
  name: string;
  icon: string;
  ext: string;
  type: FileExplorerTypes;
  children?: string[];
  antivirusStatus: AntivirusFileStatus;
}

interface FilesResultDTOInterface {
  createdDate: string;
  modifiedDate: string;
  id: string;
  fileMetadata: {
    antivirusFileStatusDto: AntivirusFileStatus;
    length: number;
    path: string;
    realName: string;
  };
}

export const getExtensionFile = name => {
  var re = /(?:\.([^.]+))?$/;
  const ext = re.exec(name)[1]?.toUpperCase();
  return ext ? FileExtension[ext] || FileExtension.UNKNOWN : 'FOLDER';
};

export const createStructure = (files: any[]) => {
  // initialize resulting object
  const fileTree = Object.defineProperties(
    {},
    { __size__: { value: 0, writable: true } }
  );

  // TODO - cleanup types
  const setElement = (pathArr: string[], structure: any, file: any) => {
    if (pathArr?.length) {
      const name = pathArr[0];
      if (!structure[name]) {
        if (pathArr?.length === 1) {
          //create file
          structure[name] = {
            ...file,
          };
          // all this properties are not enumerable so won't appear in the object keys
          Object.defineProperties(structure[name], {
            ext: { value: getExtensionFile(name) },
            __type__: { value: FileExplorerTypes.FILE },
            __name__: { value: name },
          });
        } else {
          // create folder
          structure[name] = {};
          Object.defineProperties(structure[name], {
            ext: { value: 'folder' },
            __type__: { value: FileExplorerTypes.FOLDER },
            __name__: { value: name },
            __size__: { value: 0, writable: true },
          });
        }

        structure.__size__++;
      }
      // recursively call until reach file
      setElement(pathArr.slice(1), structure[name], file);
    }
    return;
  };

  files.forEach(file => {
    // split realName (path) into separate dir names
    const path = file.path.split('/');
    setElement(path, fileTree, file);
  });

  return fileTree;
};
