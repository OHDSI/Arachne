import { Status } from "../../../libs/enums";

export interface AuthModeState {
  mode: "LOCAL" | "OIDC" | null;
  selfRegistrationEnabled: boolean;
  initialized: boolean | null;
  status: Status;
  setupStatus: Status;
  setupError: string;
  registerStatus: Status;
  registerError: string;
}
