import React from 'react';
import { Spinner } from '../../Spinner/Spinner';
import { LoaderContainer } from '../Table.styles';

export const TableSpinner: React.FC<{
  isLoading: boolean;
  loadingMessage: string;
}> = ({ isLoading = false, loadingMessage = '' }) => {
  return (
    <>
      {isLoading && (
        <LoaderContainer
          className="table-loader"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div>
            <Spinner size={80} color="primary" thickness={6} />
            {loadingMessage && (
              <div className="table-loader-message">{loadingMessage}</div>
            )}
          </div>
        </LoaderContainer>
      )}
    </>
  );
};
