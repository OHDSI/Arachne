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

import { Grid, Input, Button, Spinner } from "../../libs/components";

import {
  Box,
  Alert,
  Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import {
  FormControl,
  LogInText,
  LoginFormContainer,
  LoginFormHeader,
  LogoContainer,
  WelcomeText,
  WrapperAlert,
  Divider,
} from "./LoginPage.styles";
import { userSignIn } from "../../store/modules";
import { Status } from "../../libs";
import { LogoMediumArachne } from "../Logo";
import { useLoginOptions } from './LoginPage.hook';

export const LoginPage: React.FC<{ loginStatus: Status }> = ({ loginStatus }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loginOptions, status } = useLoginOptions();
  const [userName, setUserName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(userSignIn(userName, password));
  };

  React.useEffect(() => {
    document.title = "Arachne Data Node";
  }, []);

  return (
    <Grid container height="100vh">
      <LogoContainer
        item
        container
        xs={0}
        md={6}
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <Grid item xs={5} mx="auto" my="auto">
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
      </LogoContainer>
      <LoginFormContainer item container xs={12} md={6}>
        <Box style={{ position: "relative" }} minWidth={450} width="50%" mx="auto">
          <form onSubmit={handleSubmit}>
            <Paper>
              {loginStatus === Status.ERROR && (
                <WrapperAlert>
                  <Alert severity="error">{t("forms.login.error_message")}</Alert>
                </WrapperAlert>
              )}

              <Grid container p={4} spacing={3}>
                <Grid item xs={12} spacing={2} container>
                  <WelcomeText item xs={12}>
                    {t("pages.login.welcome")}
                  </WelcomeText>
                  <LoginFormHeader item xs={12}>
                    {t("pages.login.header")}
                  </LoginFormHeader>
                </Grid>

                <Grid item xs={12} spacing={2} container>
                  <FormControl item xs={12}>
                    <label>{t("forms.login.username")}</label>
                    <Input
                      fullWidth
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      placeholder={t("forms.login.username_placeholder")}
                    />
                  </FormControl>
                  <FormControl item xs={12}>
                    <label>{t("forms.login.password")}</label>
                    <Input
                      fullWidth
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={t("forms.login.password_placeholder")}
                    />
                  </FormControl>
                  <Grid item xs={12} textAlign="right">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      type="submit"
                      fullWidth
                      disabled={(!userName || !password) || loginStatus === Status.IN_PROGRESS}
                    >
                      {loginStatus === Status.IN_PROGRESS ? (
                        <>
                          <LogInText>{t("forms.login.submit_button")}</LogInText><Spinner size={18} />
                        </>
                      ) : (
                        <>{t("forms.login.submit_button")}</>
                      )}
                    </Button>
                  </Grid>

                  {Object.keys(loginOptions).map((key, index) => (
                      <Grid item xs={12} key={key + index}>
                        {index === 0 && <Divider />}
                        <Button
                            onClick={() => {
                              location.href = `/oauth2/authorization/${key}`;
                            }}
                            variant="outlined"
                            fullWidth
                            startIcon={
                              loginOptions[key].image ? (
                                  <img src={loginOptions[key].image} height={16} />
                              ) : undefined
                            }
                        >
                          {loginOptions[key].text}
                        </Button>
                      </Grid>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </form>
        </Box>
      </LoginFormContainer>
    </Grid>
  );
};
