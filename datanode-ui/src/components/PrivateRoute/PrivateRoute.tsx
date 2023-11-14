import React, { useEffect } from 'react';

import { Outlet } from 'react-router-dom';
// import { SpinnerWidgetContainer } from '@prometheus/features';

import { useDispatch, useSelector } from 'react-redux';
import { LoginPage } from '../LoginPage';
import { LayoutSpinner } from '../AppLayout/AppLayout.styles';
// import { getUser } from '@prometheus/redux';
import { Status } from '../../libs/enums';
import { SpinnerWidgetContainer } from '../../libs/components/Spinner/SpinnerContainers';
import { getUser } from '../../store/modules';

export const PrivateRoute = (props: any) => {
  const { ...passProps } = props;
  const dispatch = useDispatch();
  const getCurrentUser = () => dispatch(getUser());

  useEffect(() => {
    getCurrentUser();
  }, []);

  const status = useSelector<any, Status>(
    (state: any) => state.user.status
  );
  const loginStatus = useSelector<any, Status>(
    (state: any) => state.user.loginStatus
  );

  if (status === Status.IN_PROGRESS || status === Status.INITIAL) {
    return (
      <SpinnerWidgetContainer>
        <LayoutSpinner size={70} />
      </SpinnerWidgetContainer>
    );
  }
  // if (true) {
  if (status === Status.SUCCESS) {
    return <Outlet {...passProps} />;
  }

  return <LoginPage hasError={loginStatus === Status.ERROR} />;
  // return <Outlet {...passProps} />;
};
