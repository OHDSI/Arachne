/** Put data in a file and download from browser */
export const downloadFile = (
  content: any,
  fileName: string,
  contentType: string
): void => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};
