import React, { FC, useContext, useEffect } from 'react';
import { Breadcrumbs as UIBreadcrumbs } from '../../libs/components';
import { useNavigate } from 'react-router';
import { BreadcrumbsContainer } from './Breadcrumbs.styles';
import { useSelector } from 'react-redux';

export const Breadcrumbs: FC = () => {
  const navigate = useNavigate();
  const breadcrumbs = useSelector(
    (state: any) => state.breadcrumbs.breadcrumbs
  );

  return (
    <>
      <BreadcrumbsContainer>
        <UIBreadcrumbs
          items={breadcrumbs}
          onClick={(item: any) => navigate(item.path)}
        />
      </BreadcrumbsContainer>
    </>
  );
};
