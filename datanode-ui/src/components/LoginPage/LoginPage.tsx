import { Grid, Input, Button } from '../../libs/components';

import {
  Box,
  Alert,
  Paper
} from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { LogoLarge } from '../Logo/LogoLarge';
import {
  FormControl,
  LoginFormContainer,
  LoginFormHeader,
  LogoContainer,
  WelcomeText,
} from './LoginPage.styles';

export const LoginPage: React.FC<{ hasError: boolean }> = ({ hasError }) => {
  const dispatch = useDispatch();
  const [userName, setUserName] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <Grid container height="100vh">
      <LogoContainer
        item
        container
        xs={0}
        md={6}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        <Grid item xs={5} mx="auto" my="auto">
          <span className='temp-logo'>Arachne</span>
          <LogoLarge color="white" />
        </Grid>
      </LogoContainer>
      <LoginFormContainer item container xs={12} md={6}>
        <Box minWidth={450} width="50%" mx="auto">
          <form onSubmit={handleSubmit}>
            <Paper>
              {hasError && (
                <Alert severity="error">Wrong user name or password.</Alert>
              )}

              <Grid container p={4} spacing={3}>
                <Grid item xs={12} spacing={2} container>
                  <WelcomeText item xs={12}>
                    Welcome to Arachne Data node
                  </WelcomeText>
                  <LoginFormHeader item xs={12}>
                    Login into your account
                  </LoginFormHeader>
                </Grid>

                <Grid item xs={12} spacing={2} container>
                  <FormControl item xs={12}>
                    <label>User name</label>
                    <Input
                      fullWidth
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      placeholder="Enter user name"
                    />
                  </FormControl>
                  <FormControl item xs={12}>
                    <label>Password</label>
                    <Input
                      fullWidth
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <Grid item xs={12} textAlign="right">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      type="submit"
                      fullWidth
                    >
                      Log in
                    </Button>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Divider />
                    <Button
                      onClick={() => {
                        location.href = '/oauth2/authorization/azure';
                      }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    >
                      Sign in with Microsoft
                    </Button>
                  </Grid> */}
                </Grid>
              </Grid>
            </Paper>
          </form>
        </Box>
      </LoginFormContainer>
    </Grid>
  );
};
