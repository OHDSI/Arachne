export interface BaseResponceInterface<T = any> {
  errorCode: number;
  errorMessage: string;
  result: T;
  validatorErrors: any;
}