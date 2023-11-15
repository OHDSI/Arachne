import { FileExtension } from "../enums/FileExtension";

export type GetCodeLanguageByFileExtensionType = (
  extension: FileExtension
) => string;

export const getCodeLanguageByFileExtension: GetCodeLanguageByFileExtensionType =
  extension => {
    switch (extension) {
      case FileExtension.R:
      case FileExtension.RPROFILE:
        return 'r';
      case FileExtension.TXT:
        return 'plaintext';
      case FileExtension.SQL:
        return 'sql';
      case FileExtension.JSON:
        return 'json';
      case FileExtension.HTML:
        return 'html';
    }
    return 'plaintext';
  };
