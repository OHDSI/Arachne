import { InvitationStatus } from "../enums/InvitationStatus";


export const invitationTypes = [
  {
    value: InvitationStatus.ACCEPTED,
    name: 'Accepted',
  },
  {
    value: InvitationStatus.CANCELLED,
    name: 'Cancelled',
  },
  {
    value: InvitationStatus.REJECTED,
    name: 'Rejected',
  },
  {
    value: InvitationStatus.PENDING,
    name: 'Pending',
  },
];
