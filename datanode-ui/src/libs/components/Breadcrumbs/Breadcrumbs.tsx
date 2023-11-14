import React, { forwardRef } from 'react';
import {
  StyledBreadcrumbs,
  Link,
  BreadcrumbText,
  LinkCurrent,
  Loader,
  LoaderContainer,
} from './Breadcrumbs.styles';

export interface BreadcrumbsProps<T> {
  items: Array<{ name: string } & T>;
  onClick(item?: { name: string } & T): void;
  className?: string;
  isLoading?: boolean;
}

export const Breadcrumbs = <T extends object>(props: BreadcrumbsProps<T>) => {
  let breadcrumbs = [...props?.items];
  const currentLink = breadcrumbs?.pop();

  return !props.isLoading ? (
    <StyledBreadcrumbs classes={{ separator: 'breadcrumbs-separator' }}>
      {breadcrumbs.map((item, index) => (
        <Link
          key={item?.name + index}
          onClick={() => props.onClick(item)}
          className="c-breadcrumb-link"
        >
          <BreadcrumbText className="c-breadcrumb-text">
            {item?.name}
          </BreadcrumbText>
        </Link>
      ))}
      <LinkCurrent>
        {currentLink &&
          (currentLink.name ? (
            <BreadcrumbText className="c-breadcrumb-text-current">
              {currentLink?.name}
            </BreadcrumbText>
          ) : (
            <Loader
              height={26}
              width={200}
              key="loader"
              style={{ marginBottom: 8 }}
            />
          ))}
      </LinkCurrent>
    </StyledBreadcrumbs>
  ) : (
    <LoaderContainer key="loader">
      <Loader height={16} width={100} />
      <Loader height={26} width={200} />
    </LoaderContainer>
  );
};
