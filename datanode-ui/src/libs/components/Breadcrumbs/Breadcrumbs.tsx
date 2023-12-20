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

import React, { forwardRef } from "react";
import {
  StyledBreadcrumbs,
  Link,
  BreadcrumbText,
  LinkCurrent,
  Loader,
  LoaderContainer,
} from "./Breadcrumbs.styles";

export interface BreadcrumbsProps<T> {
  items: Array<{ name: string } & T>;
  onClick(item?: { name: string } & T): void;
  className?: string;
  isLoading?: boolean;
}

export const Breadcrumbs = <T extends object>(props: BreadcrumbsProps<T>) => {
  const breadcrumbs = [...props?.items];
  const currentLink = breadcrumbs?.pop();

  return !props.isLoading ? (
    <StyledBreadcrumbs classes={{ separator: "breadcrumbs-separator" }}>
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
