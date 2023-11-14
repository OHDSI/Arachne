import React from 'react';

export interface AuthorCellProps {
  value: any;
}
export const AuthorCell: React.FC<AuthorCellProps> = ({ value }) => {
  return (
    <div>
      {value?.user ? `${value.user.firstName} ${value.user.lastName}` : value}
    </div>
  );
};
