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

import React from "react";
import { useTheme, Menu } from "@mui/material";


export const UserMenu: React.FC<{
  anchorEl: Element;
  open: boolean;
  onClose: () => void;
  onContextSwitch: (tenantId: string) => any;
  currentUser: any;
}> = ({ anchorEl, open, onClose, onContextSwitch, currentUser }) => {
  const theme: any = useTheme();

  return (
    <>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{
          "aria-labelledby": "user-menu-button",
          role: "listbox",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            boxShadow: theme.customShadows[1],
            mt: 1.5,
            minWidth: 200,
          },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        {/* <Link to={'/users/' + currentUser.id}>
          <MenuItem
            sx={{ px: 2, justifyContent: 'space-between' }}
            className="context-switch"
          >
            <Grid item sx={{ fontSize: 14, textAlign: 'left' }}>
              <Grid item xs={12} fontWeight="400">
                User Profile
              </Grid>
            </Grid>
          </MenuItem>
        </Link> */}
      </Menu>
    </>
  );
};
