
import React from 'react';
import { Tooltip } from '../../Tooltip/Tooltip';
import { Box } from '@mui/material';

export const ListCell: React.FC<{ value: string[] }> = ({ value }) => {
  const itemsHiddenCount = value?.length - 1;
  if (!Array.isArray(value)) {
    console.error('WRONG DATA TYPE PROVIDED FOR <ListCell>');
    return <>-</>;
  }
  return value?.length ? (
    <Tooltip
      text={
        itemsHiddenCount && value
          ? value.map((item, index) => <div key={item + index}>{item}</div>)
          : ''
      }
    >
      <Box component="span">
        {value[0]}
        {!!itemsHiddenCount && (
          <Box
            sx={(theme: any) => ({
              backgroundColor: theme.palette.grey[800],
              borderRadius: '2px',
              color: theme.palette.textColor.primary,
              fontSize: 12,
              p: '3px 4px',
              display: 'inline-flex',
              height: 20,
              boxSizing: 'border-box',
              ml: 1,
            })}
          >
            + {itemsHiddenCount}
          </Box>
        )}
      </Box>
    </Tooltip>
  ) : (
    <>-</>
  );
};
