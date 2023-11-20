import React from 'react';
import { IconButtonStyled } from './SimpleRedirectBlock.styles';

import { Button, Grid, Icon, IconName, Block } from '../../../libs/components';

export interface SimpleRedirectBlockProps {
  iconName: IconName;
  title: string;
  description: string;
  onClick?: any;
  buttonName?: string;
}

export const SimpleRedirectBlock: React.FC<SimpleRedirectBlockProps> = ({
  title,
  onClick,
  iconName,
  description,
  buttonName,
}) => {
  return (
    <Block minHeight="100%" elevated>
      <Grid
        container
        p={3}
        spacing={2}
        sx={{ display: 'flex', flexWrap: 'nowrap' }}
      >
        <Grid item mb={1}>
          <Grid
            item
            sx={{
              background: '#ddeff580',
              borderRadius: '50%',
              width: 70,
              height: 70,
              padding: '14px',
            }}
          >
            <IconButtonStyled
              name="icon-button"
              onClick={() => {
                onClick?.();
              }}
            >
              <Icon
                iconName={iconName}
                plain
                sx={{ fontSize: 40, color: '#A9BAD4' }}
              />
            </IconButtonStyled>
          </Grid>
        </Grid>
        <Grid item>
          <Grid
            item
            xs={12}
            sx={theme => ({
              '.title': {
                fontSize: 15,
                fontWeight: 600,
                color: 'textColor.header',
                marginBottom: 0.5,
              },
              '.description': {
                fontSize: 13,
                color: theme.palette.grey[600],
              },
            })}
          >
            <div className="title">{title}</div>
            <div className="description">{description}</div>
          </Grid>

          {buttonName && (
            <Grid item xs={12} mt={1}>
              <Button
                onClick={() => onClick?.()}
                variant="outlined"
                size="small"
                name="save"
              >
                {buttonName}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Block>
  );
};
