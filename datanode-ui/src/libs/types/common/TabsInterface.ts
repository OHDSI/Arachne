export interface TabsInterface<T = any> {
  title: string;
  value: string;
  end?: boolean;
  onTabClick?: (value: T) => void;
}