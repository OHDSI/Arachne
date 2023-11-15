export enum FileContentType {
  APPLICATION_JSON = 'application/json',
  APPLICATION_TEXT = 'application/text',
}

export const commonCodeEditorOptions = {
  contextmenu: false,
  readOnly: true,
  domReadOnly: true,
  scrollBeyondLastLine: false,
  wordWrap: 'wordWrapColumn',
  wrappingStrategy: 'advanced',
  tabSize: 2,
  minimap: {
    enabled: false,
  },
  parameterHints: {
    enabled: false,
  },
  inlineHints: {
    enabled: false,
  },
  hover: {
    enabled: false,
  },
};

export const validationCodeEditorOptions = {
  parameterHints: {
    enabled: true,
  },
  inlineHints: {
    enabled: true,
  },
  hover: {
    enabled: true,
  },
};
