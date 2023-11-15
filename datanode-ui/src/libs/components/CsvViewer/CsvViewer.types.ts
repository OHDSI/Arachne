export interface ICsvViewerProps {
  data: any;
  height?: number;
  downloadMethod?: (document: any) => void;
}

export interface IParseCsvFnReturn {
  columns: any;
  rows: Record<string, any>[];
}
