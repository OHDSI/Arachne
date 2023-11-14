import { Button, Grid, Icon } from '../';
import React from 'react';
import { NoDataText } from './EmptyTableStub.styles';

export const EmptyTableStub: React.FC<{
  addButtonText?: string;
  noDataText?: string;
  onAdd?: () => void;
  className?: string;
  size?: 'small' | 'large';
  dark?: boolean;
}> = ({
  addButtonText,
  onAdd,
  className = '',
  size = 'small',
  noDataText,
  dark,
}) => {
    return (
      <Grid
        container
        justifyContent="space-around"
        spacing={1}
        p={3}
        className={className + ' empty-table-stub'}
      >
        <Grid item xs={12} textAlign="center">
          <Icon
            iconName="emptyTable"
            sx={{ fontSize: size === 'small' ? 80 : 160 }}
            color={dark ? 'primary' : undefined}
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <NoDataText>{noDataText || ''}</NoDataText>
        </Grid>
        {addButtonText && onAdd && (
          <Grid item xs={12} textAlign="center" mt={0.5}>
            <Button
              size="small"
              variant="outlined"
              onClick={onAdd}
              color={dark ? 'primary' : 'info'}
              startIcon={<Icon iconName="add" />}
              sx={(theme: any) => ({
                fontSize: { xsmall: 14, small: 16 }[size] || 14,
                px: 1.5,
                height: 32,
                fontWeight: 600,
                borderColor: theme.palette.borderColor.main,
                ...(dark && { color: theme.palette.primary.main }),
              })}
            >
              {addButtonText}
            </Button>
          </Grid>
        )}
      </Grid>
    );
  };
