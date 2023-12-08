import { FileExtension } from '../../enums/FileExtension';
import { FileContentType } from './CodeEditor.constants';
import { EditorProps } from '@monaco-editor/react';

export interface ICodeEditorProps extends EditorProps {
  title?: string;
  tooltipText?: string;
  fileName?: string;
  fileExtension?: FileExtension;
  contentType?: FileContentType;
  data: any;
  language?: string;
  height?: string | number;
  editorOptions?: Record<string, any>;
  containerStyles?: Record<string, string | number>;
  readOnly?: boolean;
  onChange?: (value?: string) => void;
  enableValidation?: boolean;
  enableDownload?: boolean;
  enableCopy?: boolean;
  remoteFile?: boolean;
  downloadMethod?: (document: any) => void;
  consoleMode?: boolean;
}
