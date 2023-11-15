import { merge } from 'lodash';
import {
  commonCodeEditorOptions,
  validationCodeEditorOptions,
} from './CodeEditor.constants';
export function getCodeEditorOptions(
  userOptions: Record<string, any>,
  enableValidation: boolean = true
) {
  if (!userOptions.readOnly && enableValidation) {
    return merge(
      commonCodeEditorOptions,
      validationCodeEditorOptions,
      userOptions
    );
  }
  return merge(commonCodeEditorOptions, userOptions);
}
