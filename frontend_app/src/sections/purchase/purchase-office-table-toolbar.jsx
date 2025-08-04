import { useMemo, useContext, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Button, Autocomplete } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { isClient } from 'src/utils/check-permissions';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { LoadingContext } from 'src/auth/context/loading-context';

// ----------------------------------------------------------------------

export function PurchaseOfficeTableToolbar({
  filters,
  loadedUsers,
  openClientFilter,
  onResetPage,
  options,
  dataFiltered,
  headersCSV,
  setUpdating,
  isListAll = true,
  title,
  setTitleLinearProgress
}) {
  const popover = usePopover();
  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { setLoading, setError, setComponent } = useContext(LoadingContext);

  const handleFilterText = useCallback(
    (event, property) => {
      onResetPage();
      filters.setState({ [property]: event.target.value });
    },
    [filters, onResetPage]
  );

  const validConfirmationNumber = (value) => value.length === 15 && /^[0-9A-Z]+$/.test(value);

  const validPinNumber = (value) => value.length === 4 && /^[0-9]+$/.test(value);

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >

        <Stack direction="row" alignItems="left" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <Button
            color="inherit"
            onClick={openClientFilter.onTrue}
            endIcon={
              <Iconify
                icon={openClientFilter.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 1 }}
              />
            }
            sx={{ width: 0.5, justifyContent: 'flex-start', textTransform: 'none' }}
          >
            {!!filters.state.client.id && !!filters.state.client.name
              ? `Client: ${filters.state.client.name}`
              : 'Select Client'}
          </Button>
          {(!!filters.state.client.id && !!filters.state.client.name) && (
            <>
              <TextField
                fullWidth
                value={filters.state.confirmationNumber}
                onChange={(e) => handleFilterText(e, 'confirmationNumber')}
                placeholder="CONFIRMATION #"
                // disabled={dataFiltered?.length === 0}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                value={filters.state.pinNumber}
                onChange={(e) => handleFilterText(e, 'pinNumber')}
                placeholder="PIN #"
                // disabled={dataFiltered?.length === 0}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                startIcon={<Iconify icon="mdi:tag-find-outline" />}
                sx={{ width: 0.3, justifyContent: 'flex-start', textTransform: 'none' }}
                disabled={
                  filters.state.client.id.length === 0 || 
                  filters.state.client.name.length === 0 || 
                  filters.state.confirmationNumber.length === 0 ||
                  filters.state.pinNumber.length === 0
                }
              >
                Search
              </Button>
            </>
          )}

          <ConfirmDialog
            open={openClientFilter.value}
            onClose={openClientFilter.onFalse}
            title="Select Client"
            content={
              <Autocomplete
                disablePortal={false}
                PopperProps={{ container: document.body }}
                options={loadedUsers.filter((user) => isClient(user.userRole.name))}
                value={filters.state.client.id ? loadedUsers.find((user) => user.id === filters.state.client.id) : null}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.username})`}
                onChange={(_, value) => {
                  if (value) {
                    const clientName = `${value.firstName} ${value.lastName}` || '';
                    filters.setState({ client: { id: value.id, name: clientName } });
                    localStorage.setItem('purchaseFilterClient', JSON.stringify({ id: value.id, name: clientName }));
                  } else {
                    filters.setState({ client: { id: '', name: '' } });
                    localStorage.removeItem('purchaseFilterClient');
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
                sx={{
                  width: '100%'
                }}
              />
            }
            action={
              <Button
                variant="contained"
                onClick={() => {
                  // onCloseClientFilter();
                  filters.setState({ client: { id: '', name: '' } });
                  localStorage.removeItem('purchaseFilterClient');
                }}
                color='warning'
              >
                Clear
              </Button>
            }
          />
        </Stack>
      </Stack>

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
              // generatePrintablePDF({ data: dataFiltered, title });
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
