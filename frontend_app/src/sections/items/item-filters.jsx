import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip, MenuItem, MenuList, IconButton, Typography, ListItemIcon, ListItemText } from '@mui/material';

import { isClient } from 'src/utils/check-permissions';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { LoadingContext } from 'src/auth/context/loading-context';

// ----------------------------------------------------------------------

export function ItemFilters({
  filters,
  // loadedUsers,
  // options,
  dateError,
  onResetPage,
  // openDateRange,
  // onOpenDateRange,
  // onCloseDateRange,
  // openInstallerFilter,
  // onOpenInstallerFilter,
  // onCloseInstallerFilter,
}) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { isMobile } = useContext(LoadingContext)
  const popover = usePopover();

  const popoverCustom = usePopover();

  const popoverTypeList = usePopover();

  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const [isTypeListOpen, setIsTypeListOpen] = useState(false);

  const defaultCustom = { hasPermission: false, isPreparation: { value: false } };

  const custom = filters.state.custom || defaultCustom;


  const createCustomFilterName = useCallback(() => {
    const name = filters.state.list === 'in progress' ? 'In progress' : 'Finished';
    const active = [];
    // if (custom.hasPermission) active.push('Need permission');
    // if (custom.isPreparation?.value) active.push('In preparation stage');
    // if (custom.isCoordination?.value) active.push('In coordination stage');
    // if (custom.isInstallation?.value) active.push('In installation stage');
    // if (custom.isPermission?.value) active.push('In permission stage');
    // if (custom.isClosing?.value) active.push('In closing stage');
    // if (custom.hasComments) active.push('Have comments');
    // if (filters.state.startDate && filters.state.endDate) active.push(fDateRangeShortLabel(filters.state.startDate, filters.state.endDate));
    if (filters.state.name) active.push(`Matches: ${filters.state.name}`);
    // if (filters.state.installer.id) active.push(`Installer: ${filters.state.installer.name}`);
    return active.length > 0 ? `${name} Items (${active.join(', ')})` : `${name} Items`;
  }, [
    filters,
    // custom,
  ]);

  const [customFilterName, setCustomFilterName] = useState(() => createCustomFilterName());

  const [customMarginTypeList, setCustomMarginTypeList] = useState(0);

  useEffect(() => {
    setCustomFilterName(createCustomFilterName());
  }, [createCustomFilterName]);

  const handleFilterTypeList = useCallback((typeName) => {
    onResetPage();
    filters.setState({
      list: typeName,
    });
    localStorage.setItem('projectFilterList', typeName);
  }, [filters, onResetPage]);

  const handleFilterCustom = useCallback((fieldName) => {
    onResetPage();
    if (fieldName === 'hasPermission') {
      const hasPermission = !filters.state.custom.hasPermission;
      filters.setState({
        custom: {
          ...filters.state.custom,
          hasPermission,
        },
      });
      localStorage.setItem('projectFilterCustom', JSON.stringify({ ...filters.state.custom, hasPermission }));
    } else if (fieldName === 'isPreparation' ||
      fieldName === 'isCoordination' ||
      fieldName === 'isInstallation' ||
      fieldName === 'isPermission' ||
      fieldName === 'isClosing') {
      const value = !filters.state.custom[fieldName].value;
      const name = fieldName.substring(2).toLowerCase();
      filters.setState({
        custom: {
          ...filters.state.custom,
          [fieldName]: {
            value,
            name,
          },
        },
      });
      localStorage.setItem('projectFilterCustom', JSON.stringify({ ...filters.state.custom, [fieldName]: { value, name } }));
    } else if (fieldName === 'hasComments') {
      const hasComments = !filters.state.custom.hasComments;
      filters.setState({
        custom: {
          ...filters.state.custom,
          hasComments,
        },
      });
      localStorage.setItem('projectFilterCustom', JSON.stringify({ ...filters.state.custom, hasComments }));
    }
    setCustomFilterName(createCustomFilterName());
  }, [filters, createCustomFilterName, onResetPage, setCustomFilterName]);


  // const handleFilterInstaller = useCallback(
  //   (event) => {
  //     const id = event.target.value;
  //     onResetPage();
  //     const user = loadedUsers.find((u) => u.id === id);
  //     filters.setState({
  //       installer: {
  //         id,
  //         name: user?.name || ''
  //       }
  //     });
  //     localStorage.setItem('projectFilterInstaller', JSON.stringify({ id, name: user?.name || '' }));
  //   },
  //   [loadedUsers, filters, onResetPage]
  // );


  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value });
      localStorage.setItem('projectFilterName', event.target.value);
    },
    [filters, onResetPage]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ startDate: newValue });
      localStorage.setItem('projectFilterStartDate', newValue);
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      filters.setState({ endDate: newValue });
      localStorage.setItem('projectFilterEndDate', newValue);
    },
    [filters]
  );

  const handleFilterType = useCallback(
    (newValue) => {
      const checked = filters.state.type.includes(newValue)
        ? filters.state.type.filter((value) => value !== newValue)
        : [...filters.state.type, newValue];

      filters.setState({ type: checked });
      localStorage.setItem('projectFilterType', JSON.stringify(checked));
    },
    [filters]
  );

  const handleResetType = useCallback(() => {
    popover.onClose();
    filters.setState({ type: [] });
    localStorage.setItem('projectFilterType', JSON.stringify([]));
  }, [filters, popover]);


  // const renderFilterInstaller = (
  //   <>
  //     <Button
  //       color="inherit"
  //       onClick={onOpenInstallerFilter}
  //       endIcon={
  //         <Iconify
  //           icon={openInstallerFilter ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
  //           sx={{ ml: -0.5 }}
  //         />
  //       }
  //     >
  //       {!!filters.state.installer.id && !!filters.state.installer.name
  //         ? `Installer: ${filters.state.installer.name}`
  //         : 'Select installer'}
  //     </Button>

  //     <ConfirmDialog
  //       open={openInstallerFilter}
  //       onClose={onCloseInstallerFilter}
  //       title="Select installer"
  //       content={
  //         <TextField
  //           select
  //           value={filters.state.installer.id || ''}
  //           onChange={handleFilterInstaller}
  //           placeholder="Select installer"
  //           InputProps={{
  //             startAdornment: (
  //               <InputAdornment position="start">
  //                 <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
  //               </InputAdornment>
  //             ),
  //           }}
  //           sx={{ width: '100%' }}
  //         >
  //           {loadedUsers.filter((user) => isInstaller(user.userRole.name)).map((user) => (
  //             <MenuItem key={user.id} value={user.id}>
  //               {user.name}
  //             </MenuItem>
  //           ))}
  //         </TextField>
  //       }
  //       action={
  //         <Button
  //           variant="contained"
  //           onClick={() => {
  //             // onCloseInstallerFilter();
  //             filters.setState({ installer: { id: null, name: null } });
  //             localStorage.removeItem('projectFilterInstaller');
  //           }}
  //           color='warning'
  //         >
  //           Clear
  //         </Button>
  //       }
  //     />
  //   </>
  // );


  // const renderFilterDate = (isRenderCustom = false) => (
  //   <>
  //     <Button
  //       color="inherit"
  //       onClick={onOpenDateRange}
  //       startIcon={isRenderCustom ? <Iconify icon="eva:calendar-outline" /> : null}
  //       endIcon={
  //         <Iconify
  //           icon={!isRenderCustom ? openDateRange ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill' : null}
  //           sx={{ ml: -0.5 }}
  //         />
  //       }
  //     >
  //       {!!filters.state.startDate && !!filters.state.endDate
  //         ? fDateRangeShortLabel(filters.state.startDate, filters.state.endDate)
  //         : 'Select installation date'}
  //     </Button>

  //     <CustomDateRangePicker
  //       variant="calendar"
  //       title="Select installation date range"
  //       startDate={filters.state.startDate}
  //       endDate={filters.state.endDate}
  //       onChangeStartDate={handleFilterStartDate}
  //       onChangeEndDate={handleFilterEndDate}
  //       open={openDateRange}
  //       onClose={onCloseDateRange}
  //       selected={!!filters.state.startDate && !!filters.state.endDate}
  //       error={dateError}
  //     />
  //   </>
  // );

  const renderCustomFilters = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', minWidth: 100, p: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          p: 0.5,
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'fontWeightBold' }} onClick={!isClient(userLogged?.data?.user_role?.name) ?
          (e) => {
            setCustomMarginTypeList(-5);
            popoverTypeList.onOpen(e);
            setIsTypeListOpen((prev) => !prev);
          } : null
        }>
          {customFilterName}
        </Typography>
      </Box>
      <CustomPopover
        open={popoverTypeList.open}
        anchorEl={popoverTypeList.anchorEl}
        onClose={(e) => {
          popoverTypeList.onClose(e);
          setIsTypeListOpen(false);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{ paper: { sx: { p: 0, width: 260, ml: !isMobile ? customMarginTypeList : 0, mt: 2 } } }}
        sx={{ maxHeight: 800, overflowY: 'auto', overflowX: 'hidden' }}
      >
        <Stack spacing={0} sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: 500, p: 1 }}>
            <MenuList sx={{ p: 1 }}>

              <MenuItem sx={{ py: 1 }} onClick={(e) => {
                handleFilterTypeList('in progress');
                popoverTypeList.onClose(e);
                setIsTypeListOpen(false);
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon>
                    <Iconify icon="grommet-icons:in-progress" sx={{ color: 'text.disabled' }} />
                  </ListItemIcon>
                  <ListItemText primary="In progress installations" />
                </Box>
              </MenuItem>
              <MenuItem sx={{ py: 1 }} onClick={(e) => {
                handleFilterTypeList('finished');
                popoverTypeList.onClose(e);
                setIsTypeListOpen(false);
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon>
                    <Iconify icon="octicon:tracked-by-closed-completed-16" sx={{ color: 'text.disabled' }} />
                  </ListItemIcon>
                  <ListItemText primary="Finished installations" />
                </Box>
              </MenuItem>
            </MenuList>
          </Box>
        </Stack>
      </CustomPopover>
      <CustomPopover
        open={popoverCustom.open}
        anchorEl={popoverCustom.anchorEl}
        onClose={(e) => {
          popoverCustom.onClose(e);
          setIsCustomOpen(false);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{ paper: { sx: { p: 0, width: 302, ml: !isMobile ? -35 : 0, mt: 2 } } }}
        sx={{ maxHeight: 800, overflowY: 'auto', overflowX: 'hidden' }}
      >
        <Stack spacing={0} sx={{ py: -1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: 500, p: 0 }}>
            <MenuList sx={{ p: 0 }}>
              <MenuItem sx={{ p: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0, mt: 1, ml: 1 }}>
                  <Tooltip title="Search item(s) by NAME or SKU...">
                    <TextField
                      value={filters.state.name}
                      onChange={handleFilterName}
                      placeholder="Search item(s) by NAME or SKU..."
                      onKeyDown={(e) => e.stopPropagation()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                onResetPage();
                                filters.setState({ name: '' });
                              }}
                              variant='text'
                              sx={{ color: 'text.disabled' }}
                            >
                              <Iconify icon="eva:close-circle-fill" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: '100%' }}
                    />
                  </Tooltip>
                </Box>
              </MenuItem>

              {/* {filters.state.list === 'in progress' && [
                <MenuItem key="permission-divider" sx={{ py: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', py: 0 }}>
                    <Divider orientation="vertical" flexItem sx={{ color: 'text.disabled' }}>
                      <ListItemText primary="Need installation permission" />
                    </Divider>
                  </Box>
                </MenuItem>,
                <MenuItem key="has-permission" sx={{ py: 0 }} onClick={() => handleFilterCustom('hasPermission')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon>
                      <CheckBox
                        checked={filters.state.custom.hasPermission}
                        onChange={() => handleFilterCustom('hasPermission')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Need permission?" />
                  </Box>
                </MenuItem>,
                <MenuItem key="stages-divider" sx={{ py: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', py: 0 }}>
                    <Divider orientation="vertical" flexItem sx={{ color: 'text.disabled' }}>
                      <ListItemText primary="Stages" />
                    </Divider>
                  </Box>
                </MenuItem>,
                <MenuItem key="preparation" sx={{ py: 0 }} onClick={() => handleFilterCustom('isPreparation')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon>
                      <CheckBox
                        checked={filters.state.custom.isPreparation.value}
                        onChange={() => handleFilterCustom('isPreparation')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Preparation Stage" />
                  </Box>
                </MenuItem>,
                <MenuItem key="coordination" sx={{ py: 0 }} onClick={() => handleFilterCustom('isCoordination')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon>
                      <CheckBox
                        checked={filters.state.custom.isCoordination.value}
                        onChange={() => handleFilterCustom('isCoordination')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Coordination Stage" />
                  </Box>
                </MenuItem>,
                <MenuItem key="installation" sx={{ py: 0 }} onClick={() => handleFilterCustom('isInstallation')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon>
                      <CheckBox
                        checked={filters.state.custom.isInstallation.value}
                        onChange={() => handleFilterCustom('isInstallation')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Installation Stage" />
                  </Box>
                </MenuItem>,
                <MenuItem key="permission" sx={{ py: 0 }} onClick={() => handleFilterCustom('isPermission')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon>
                      <CheckBox
                        checked={filters.state.custom.isPermission.value}
                        onChange={() => handleFilterCustom('isPermission')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Permission Stage" />
                  </Box>
                </MenuItem>,
                <MenuItem key="closing" sx={{ py: 0 }} onClick={() => handleFilterCustom('isClosing')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon>
                      <CheckBox
                        checked={filters.state.custom.isClosing.value}
                        onChange={() => handleFilterCustom('isClosing')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Closing Stage" />
                  </Box>
                </MenuItem>
              ]}
              <MenuItem sx={{ py: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 0 }}>
                  <Divider orientation="vertical" flexItem sx={{ color: 'text.disabled' }} >
                    <ListItemText primary="Comments" />
                  </Divider>
                </Box>
              </MenuItem>
              <MenuItem sx={{ py: 0 }} onClick={() => handleFilterCustom('hasComments')}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon>
                    <CheckBox
                      checked={filters.state.custom.hasComments}
                      onChange={() => handleFilterCustom('hasComments')}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Has Comments?" />
                </Box>
              </MenuItem> */}
              <MenuItem sx={{ py: 0, mb: 1 }} />
            </MenuList>
          </Box>
        </Stack>
      </CustomPopover>
    </Box>
  )

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1, mb: 0 }}
    >
      {renderCustomFilters}
      {/* {renderFilterName} */}

      {/* <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {!isInstaller(userLogged?.data?.user_role?.name) && (
          <>
            {renderFilterInstaller}
            {renderFilterDate()}
          </>
        )}
        {renderFilterType}
      </Stack> */}
    </Stack>
  );
}
