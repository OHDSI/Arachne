
import React, { FC, ReactNode } from 'react';
import { SecondaryContentWrapper } from './SecondaryContentWrapper';
import { Block } from '../FilterPanel/FilterPanel.styles';
import { Grid } from '../Grid';
import { Button } from '../Button/Button';

export const ExportWrapper: FC<{
  children?: ReactNode;
  onButtonClick?: () => void;
}> = ({ children, onButtonClick }) => {
  return (
    <SecondaryContentWrapper>
      <Block>
        {onButtonClick && (
          <Grid item xs={12} px={2} pt={2}>
            <Button
              onClick={onButtonClick}
              variant="contained"
              size="small"
              color="info"
              sx={{ px: 2 }}
            >
              Export to {'>'}
            </Button>
          </Grid>
        )}
        <Grid item xs={12} container p={2} sx={{ width: '100%' }}>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Block>
    </SecondaryContentWrapper>
  );
};
