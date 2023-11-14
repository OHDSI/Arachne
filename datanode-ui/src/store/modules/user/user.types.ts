import { Status } from "../../../libs/enums";


export interface UserState {
  data: any;
  status: Status;
  loginStatus: Status;
  errorMessage: string;
}
