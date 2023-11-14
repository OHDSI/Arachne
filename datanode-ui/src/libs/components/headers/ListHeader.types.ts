export interface ListHeaderProps {
  title: string;
  iconName?: string;
  canImport?: boolean;
  canCreate?: boolean;
  importButtonName?: string;
  createButtonName?: string;
  onImport?: (e?: any) => void;
  onCreate?: () => void;
  count?: number;
  customButtons?: React.ReactNode;
}
