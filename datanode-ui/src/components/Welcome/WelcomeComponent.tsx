

import React, { FC, useEffect, useMemo } from 'react';
import { resetBreadcrumbs } from '../../store/modules';
import { useDispatch } from 'react-redux';
import { Grid } from '../../libs/components';

export const Welcome: FC<any> = props => {
  const { modulesSideNavigation: list } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetBreadcrumbs());
  }, []);

  const modules = useMemo(() => {
    const hashMap: any = {};
    list.forEach((elem: any) => {
      hashMap[elem.name] = elem;
    });

    return hashMap;
  }, []);

  if (!modules) {
    return <></>;
  }

  return (
    <Grid
      container
      sx={{
        backgroundColor: 'backgroundColor.dark',
        minHeight: 'calc(100vh - 50px)',
        height: '100%',
        alignContent: 'flex-start',
        '.content-block': {
          transition: 'transform 300ms',
        },
        '.content-block:hover': {
          transform: 'scale(1.01)',
          transition: 'transform 300ms',
        },
      }}
    >
      <Grid
        item
        xs={12}
        container
        justifyContent="space-around"
        sx={{
          backgroundColor: '#00B3C2',
          backgroundImage: 'url("torch.svg")',
          backgroundRepeat: 'no-repeat',
          height: 240,
          backgroundSize: 280,
          backgroundPositionY: '-35px',
          backgroundPositionX: {
            xs: 'calc(50% - 280px)',
          },
        }}
      >
        <Grid
          item
          color="#ffffff"
          fontSize={70}
          alignContent="center"
          fontWeight={600}
          flexWrap="wrap"
          textAlign="right"
          my="auto"
        >
          <Grid item fontFamily={"'Rosario', sans-serif"} pt={3}>
            Arachne
          </Grid>
          <Grid
            item
            sx={{
              bgcolor: '#ffffffd1',
              height: 38,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              color: '#006c75',
              fontSize: 24,
              letterSpacing: 1,
              width: 166,
              textAlign: 'center',
            }}
          >
            DATA NODE
          </Grid>
        </Grid>
      </Grid>

      <Grid container px={{ xs: 4, lg: 8, xl: 10 }} py={4} spacing={2}>
        <Grid item xs={12} md={6}>
          {/* <modules.submissions.component
            {...modules.submissions}
            type="component"
            name="home-widget"
          /> */}
        </Grid>
        <Grid item xs={12} md={6}>
          {/* <HomeWidget /> */}
        </Grid>
      </Grid>
    </Grid>
  );
};
