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

import React, { useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  AutocompleteInput,
  Block,
  Button,
  FormActionsContainer,
  FormElement,
  Grid,
  Icon,
  SecondaryContentWrapper,
  useNotifications
} from "../../../../libs/components";
import { addUser, searchUsers } from "../../../../api/admin";
import { SelectInterface, UserDTOSearchInterface } from "../../../../libs/types";
import { parseToSelectControlOptions } from "../../../../libs/utils";

interface AddUserFormPropsInterface {
  onCancel: () => void;
  afterCreate: () => void;
}


export const AddUserForm: React.FC<AddUserFormPropsInterface> =
  memo(props => {
  	const { onCancel, afterCreate } = props;
  	const { t } = useTranslation();
  	const { enqueueSnackbar } = useNotifications();

  	const [user, setUser] = useState<SelectInterface>(null);
  	const [users, setUsers] = useState<SelectInterface[]>([]);
  	const [searchUser, serUserSearch] = useState<string>("");

  	const search = async (value) => {
  		const result: UserDTOSearchInterface[] = await searchUsers(value);
  		setUsers(parseToSelectControlOptions(
  			result.map(user => ({ ...user, fullname: `${user.firstname} ${user.lastname}` })),
  			"fullname",
  			"username"
  		));
  	};

  	const onAddUser = async () => {
  		try {
  			const result: UserDTOSearchInterface = await addUser(user.value);
  			enqueueSnackbar({
  				message: `${t("pages.administration.users.success_message")} ${result.firstname} ${result.lastname}`,
  				variant: "success",
  			} as any);
  			afterCreate?.();
  		} catch (e) {
  			console.log(e);
  		}
  	};

  	useEffect(() => {
  		search(searchUser);
  	}, [searchUser]);

  	return (
  		<Grid container>
  			<SecondaryContentWrapper>
  				<Block>
  					<Grid container spacing={2} p={2}>
  						<Grid item xs={12}>
  							<FormElement name="users" textLabel={t("forms.add_user.users")} required>
  								<AutocompleteInput
  									value={user?.name}
  									onChange={(name: string) => {
  										const userValue = users.find(elem => elem.name === name);

  										setUser(userValue);
  									}}
  									onInputChange={(value: string) => {
  										serUserSearch(value);
  									}}
  									options={users}
  								/>
  							</FormElement>
  						</Grid>
  						<Grid item xs={12}>
  							<FormActionsContainer>
  								<Button
  									variant="outlined"
  									onClick={onCancel}
  									size="small"
  									startIcon={<Icon iconName="deactivate" />}
  								>
  									{t("common.buttons.cancel")}
  								</Button>
  								<Button
  									onClick={onAddUser}
  									variant="contained"
  									size="small"
  									color="success"
  									startIcon={<Icon iconName="submit" />}
  								>
  									{t("common.buttons.add")}
  								</Button>
  							</FormActionsContainer>
  						</Grid>
  					</Grid>
  				</Block>
  			</SecondaryContentWrapper>
  		</Grid>
  	);
  });
