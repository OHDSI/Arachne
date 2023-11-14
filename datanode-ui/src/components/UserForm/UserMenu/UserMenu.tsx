import React from 'react';
import { useTheme, Menu } from '@mui/material';


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
          'aria-labelledby': 'user-menu-button',
          role: 'listbox',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            boxShadow: theme.customShadows[1],
            mt: 1.5,
            minWidth: 200,
          },
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
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
