import { Grid, Icon } from '../../../libs/components';
import React from 'react';

export interface SubModuleDescriptionBlockProps {
  children?: React.ReactNode;
  title: string;
  description: string;
  iconName: 'cohort' | 'analysis' | 'conceptSets';
}
export const SubModuleDescriptionBlock: React.FC<SubModuleDescriptionBlockProps> =
  ({ children, title, description, iconName }) => {
    return (
      <Grid
        container
        item
        xs={12}
        sx={theme => ({
          padding: 1.5,
          '&:hover': {
            backgroundColor: '#ddeff580',
            '.icon-container path': {
              fill: '#adc7ec',
            },
            '.description': {
              color: theme.palette.grey[800],
            },
          },
        })}
      >
        <Grid
          container
          spacing={2}
          flexWrap="nowrap"
          alignItems="center"
          flexDirection={{ xs: 'row', md: 'column', lg: 'row' }}
        >
          <Grid
            item
            display="flex"
            flexWrap="nowrap"
            alignItems="center"
            xs={12}
            sx={{
              cursor: 'default',
            }}
          >
            <Grid item mr={2} className="icon-container">
              <Icon
                iconName={iconName}
                sx={{ fontSize: 48 }}
                color="secondary"
              />
            </Grid>
            <Grid
              item
              sx={theme => ({
                '.title': {
                  fontSize: 15,
                  fontWeight: 500,
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
          </Grid>
          <Grid item>{children}</Grid>
        </Grid>
      </Grid>
    );
  };
