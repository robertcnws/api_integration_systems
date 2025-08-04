import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Tooltip, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { isClient, listRolesAndSubroles } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { IncrementerButton } from './components/incrementer-button';

// ----------------------------------------------------------------------

export function ItemFolderItem({
  sx,
  folder,
  selected,
  onSelect,
  onDelete,
  onViewRow,
  setTableData,
  refetchAllRewardItems,
  ...other }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const popover = usePopover();

  const confirm = useBoolean();

  const checkbox = useBoolean();

  const favorite = useBoolean(folder?.canBeBought);

  const [folderName, setFolderName] = useState(folder?.item?.name);

  const [values, setValue] = useState({
    quantity: 1,
    available: folder?.item?.stock_on_hand || 0,
  });


  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= values.available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {values.available}
        </Typography>
      </Stack>
    </Stack>
  );




  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
      <Checkbox
        color="warning"
        icon={<Iconify icon="streamline-sharp-color:mine-cart-2" />}
        checkedIcon={<Iconify icon="streamline-sharp-color:mine-cart-2-flat" />}
        checked={favorite.value}
        onChange={favorite.onToggle}
        inputProps={{
          name: 'checkbox-favorite',
          'aria-label': 'Checkbox favorite',
        }}
      />

      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  );

  const renderIcon = (
    <Box
      onMouseEnter={checkbox.onTrue}
      onMouseLeave={checkbox.onFalse}
      sx={{ width: 36, height: 36 }}
    >
      {(checkbox.value || selected) && onSelect && !isClient(userLogged?.data?.user_role?.name) ? (
        <Checkbox
          checked={selected}
          onClick={onSelect}
          icon={<Iconify icon="eva:radio-button-off-fill" />}
          checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/icons/files/ic-folder.svg`}
          sx={{ width: 1, height: 1 }}
          onClick={
            () => {
              localStorage.removeItem('projectReminderTab');
              onViewRow();
            }
          }
        />
      )}
    </Box>
  );

  const renderText = (
    <ListItemText
      // onClick={details.onTrue}
      onClick={() => {
        localStorage.removeItem('projectReminderTab');
        onViewRow();
      }}
      primary={folder?.item?.name}
      secondary={
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Tooltip title="No Closing Date">
              <Iconify icon="streamline-sharp-color:shopping-bag-hand-bag-price-tag" sx={{ color: 'error.main' }} />
            </Tooltip>
            <Box
              component="span"
              sx={{
                mx: 0.75,
                width: 2,
                height: 2,
                borderRadius: '50%',
                bgcolor: 'currentColor',
              }}
            />
            <b>{folder.assignedPoints}</b>{'  '}point(s)
          </Box>
      }
      primaryTypographyProps={{ noWrap: false, typography: 'subtitle1' }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.disabled',
        display: 'inline-flex',
      }}
    />
  );


  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          gap: 1,
          p: 2.5,
          maxWidth: 222,
          display: 'flex',
          borderRadius: 2,
          cursor: 'pointer',
          position: 'relative',
          bgcolor: 'transparent',
          flexDirection: 'column',
          alignItems: 'flex-start',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        {renderIcon}

        {renderAction}

        {renderText}

        {/* {(!!folder?.usersAssignees?.length && !isInstaller(userLogged?.data?.user_role?.name)) && renderAvatar} */}

      </Paper>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              // details.onTrue();
              localStorage.removeItem('itemReminderTab');
              onViewRow();
            }}
          >
            <Iconify icon="lsicon:view-filled" />
            View Item
          </MenuItem>

          {listRolesAndSubroles(userLogged?.data?.user_role?.name).includes(CONFIG.roles.superadmin) ? [
            <Divider key="divider" sx={{ borderStyle: 'dashed' }} />,
            <MenuItem
              key="delete"
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete Item
            </MenuItem>
          ] : null}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Project"
        content={`Are you sure want to delete project ${folderName}?`}
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
