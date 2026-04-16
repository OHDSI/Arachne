import { Grid, Input, Button, Spinner } from "../../libs/components";
import { Box, Alert, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  LogInText,
  LoginFormContainer,
  LoginFormHeader,
  LogoContainer,
  WelcomeText,
  WrapperAlert,
} from "../LoginPage/LoginPage.styles";
import { performSetup } from "../../store/modules";
import { Status } from "../../libs";
import { LogoMediumArachne } from "../Logo";
import { getPasswordPolicy, PasswordPolicy } from "../../api/auth";

export const InitialSetupPage: React.FC = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy | null>(null);
  const [localError, setLocalError] = useState("");

  const setupStatus = useSelector<any, Status>((state: any) => state.authMode.setupStatus);
  const setupError = useSelector<any, string>((state: any) => state.authMode.setupError);

  useEffect(() => {
    document.title = "Arachne Data Node - Initial Setup";
    getPasswordPolicy()
      .then(setPasswordPolicy)
      .catch((err) => {
        console.error("Failed to load password policy", err);
        setPasswordPolicy({ minLength: 8, requireUppercase: false, requireLowercase: false, requireDigit: false, requireSpecialChar: false });
      });
  }, []);

  const validatePassword = (pwd: string, policy: PasswordPolicy): string | null => {
    if (pwd.length < policy.minLength) return `Password must be at least ${policy.minLength} characters`;
    if (policy.requireUppercase && !/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (policy.requireLowercase && !/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (policy.requireDigit && !/\d/.test(pwd)) return "Password must contain at least one digit";
    if (policy.requireSpecialChar && !/[^a-zA-Z0-9]/.test(pwd)) return "Password must contain at least one special character";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (passwordPolicy) {
      const policyError = validatePassword(password, passwordPolicy);
      if (policyError) {
        setLocalError(policyError);
        return;
      }
    }
    dispatch(performSetup(username, password));
  };

  const errorMessage = localError || setupError;

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
              {errorMessage && (
                <WrapperAlert>
                  <Alert severity="error">{errorMessage}</Alert>
                </WrapperAlert>
              )}

              <Grid container p={4} spacing={3}>
                <Grid item xs={12} spacing={2} container>
                  <WelcomeText item xs={12}>
                    Welcome to Arachne Data Node
                  </WelcomeText>
                  <LoginFormHeader item xs={12}>
                    Create Admin Account
                  </LoginFormHeader>
                </Grid>

                <Grid item xs={12} spacing={2} container>
                  <FormControl item xs={12}>
                    <label>Username</label>
                    <Input
                      fullWidth
                      value={username}
                      onChange={(e: any) => setUsername(e.target.value)}
                      placeholder="Enter admin username"
                    />
                  </FormControl>
                  <FormControl item xs={12}>
                    <label>Password</label>
                    <Input
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormControl item xs={12}>
                    <label>Confirm Password</label>
                    <Input
                      fullWidth
                      type="password"
                      value={confirmPassword}
                      onChange={(e: any) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                  </FormControl>
                  {passwordPolicy && (
                    <Grid item xs={12}>
                      <Box sx={{ fontSize: 12, color: "#888" }}>
                        Minimum {passwordPolicy.minLength} characters
                        {passwordPolicy.requireUppercase && ", uppercase letter"}
                        {passwordPolicy.requireLowercase && ", lowercase letter"}
                        {passwordPolicy.requireDigit && ", digit"}
                        {passwordPolicy.requireSpecialChar && ", special character"}
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12} textAlign="right">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      type="submit"
                      fullWidth
                      disabled={!username || !password || !confirmPassword || !passwordPolicy || setupStatus === Status.IN_PROGRESS}
                    >
                      {setupStatus === Status.IN_PROGRESS ? (
                        <>
                          <LogInText>Setting up...</LogInText><Spinner size={18} />
                        </>
                      ) : (
                        <>Create Admin Account</>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </form>
        </Box>
      </LoginFormContainer>
    </Grid>
  );
};
