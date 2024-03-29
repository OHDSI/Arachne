/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import React, { useEffect } from "react";
import { resetBreadcrumbs } from "../../store/modules";
import { useDispatch } from "react-redux";
import { Grid } from "../../libs/components";
import { HomeWidget as HomeWidgetSubmission } from "../../modules/Submissions/HomeWidget";
import { HomeWidget as HomeWidgetAdmin } from "../../modules/Admin/HomeWidget";
import { LogoMediumArachne } from "../Logo";

export const Welcome: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetBreadcrumbs());
  }, [dispatch]);

  React.useEffect(() => {
    document.title = "Arachne Data Node";
  }, []);

  return (
    <Grid
      container
      sx={{
        backgroundColor: "backgroundColor.dark",
        minHeight: "calc(100vh - 50px)",
        height: "100%",
        alignContent: "flex-start",
        ".content-block": {
          transition: "transform 300ms",
        },
        ".content-block:hover": {
          transform: "scale(1.01)",
          transition: "transform 300ms",
        },
      }}
    >
      <Grid
        item
        xs={12}
        container
        justifyContent="space-around"
        sx={{
          backgroundColor: "#00B3C2",
          backgroundImage: "url(\"torch.svg\")",
          backgroundRepeat: "no-repeat",
          height: 240,
          backgroundSize: 280,
          backgroundPositionY: "-35px",
          backgroundPositionX: {
            xs: "calc(50% - 280px)",
          },
        }}
      >
        <Grid
          item
          color="#ffffff"
          fontSize={62}
          alignContent="center"
          fontWeight={600}
          flexWrap="wrap"
          textAlign="left"
          my="auto"
        >
          <div style={{ position: "absolute", marginLeft: "-190px" }}>
            <LogoMediumArachne />
          </div>
          <Grid item fontFamily={"'Rosario', sans-serif"} pt={3} style={{ marginLeft: "14px" }}>
            Arachne
          </Grid>
          <Grid
            item
            sx={{
              bgcolor: "#ffffffd1",
              height: 29,
              px: 1.5,
              py: 0.5,
              marginLeft: "157px",
              borderRadius: 1,
              color: "#006c75",
              fontSize: 18,
              letterSpacing: 1,
              width: 137,
              textAlign: "center",
            }}
          >
            DATA NODE
          </Grid>
        </Grid>
      </Grid>

      <Grid container px={{ xs: 2, lg: 4, xl: 5 }} py={4} spacing={2}>
        <Grid item xs={12} md={6}>
          <HomeWidgetSubmission />
        </Grid>
        <Grid item xs={12} md={6}>
          <HomeWidgetAdmin />
        </Grid>
      </Grid>
    </Grid>
  );
};
