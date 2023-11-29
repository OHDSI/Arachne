import { Grid, Input, Button, Spinner } from '../../libs/components';

import {
  Box,
  Alert,
  Paper
} from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  FormControl,
  LogInText,
  LoginFormContainer,
  LoginFormHeader,
  LogoContainer,
  WelcomeText,
  WrapperAlert,
} from './LoginPage.styles';
import { userSignIn } from '../../store/modules';
import { Status } from '../../libs';
import { LogoMediumArachne } from '../Logo';

export const LoginPage: React.FC<{ loginStatus: Status }> = ({ loginStatus }) => {
  const dispatch = useDispatch();
  const [userName, setUserName] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(userSignIn(userName, password));
  };

  React.useEffect(() => {
    document.title = `Arachne Data Node`;
  }, []);

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
            <div style={{ position: 'absolute', marginLeft: '-190px' }}>
              <LogoMediumArachne />
            </div>
            <Grid item fontFamily={"'Rosario', sans-serif"} pt={3} style={{ marginLeft: "14px" }}>
              Arachne
            </Grid>
            <Grid
              item
              sx={{
                bgcolor: '#ffffffd1',
                height: 29,
                px: 1.5,
                py: 0.5,
                marginLeft: '157px',
                borderRadius: 1,
                color: '#006c75',
                fontSize: 18,
                letterSpacing: 1,
                width: 137,
                textAlign: 'center',
              }}
            >
              DATA NODE
            </Grid>
          </Grid>
          {/* <LogoMediumArachne />
          <span className='temp-logo'>Arachne</span>
          <LogoLarge color="white" /> */}
        </Grid>
      </LogoContainer>
      <LoginFormContainer item container xs={12} md={6}>
        <Box style={{ position: 'relative' }} minWidth={450} width="50%" mx="auto">
          <form onSubmit={handleSubmit}>
            <Paper>
              {loginStatus === Status.ERROR && (
                <WrapperAlert>
                  <Alert severity="error">Wrong user name or password.</Alert>
                </WrapperAlert>
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
                      disabled={(!userName || !password) || loginStatus === Status.IN_PROGRESS}
                    >
                      {loginStatus === Status.IN_PROGRESS ? (
                        <>
                          <LogInText>Log in</LogInText><Spinner size={18} />
                        </>
                      ) : (
                        <>Log in</>
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
