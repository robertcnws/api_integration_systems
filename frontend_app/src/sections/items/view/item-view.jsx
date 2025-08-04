import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import { Box, Typography, LinearProgress } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { isClient } from 'src/utils/check-permissions';
import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';

import { LoadingContext } from 'src/auth/context/loading-context';
import { useDataContext } from 'src/auth/context/data/data-context';

import { ItemTable } from '../item-table';
import { ItemFilters } from '../item-filters';
import { ItemGridView } from '../item-grid-view';
import { ItemFiltersResult } from '../item-filters-result';



// ----------------------------------------------------------------------

export function ItemView() {

    const { isMobile } = useContext(LoadingContext);

    localStorage.setItem('backFromItemDetails', 'items');

    const {
        loadedAllRewardItems,
        loadedFilteredRewardItems,
        refetchAllRewardItems,
        loadingAllRewardItems,
    } = useDataContext();

    // console.log('loadedFilteredRewardItems', loadedFilteredRewardItems);

    const table = useTable({
        defaultCurrentPage: parseInt(localStorage.getItem('itemPage'), 10) || 0,
        defaultRowsPerPage: parseInt(localStorage.getItem('itemRowsPerPage'), 10) || 10,
        defaultDense: true,
        defaultOrder: 'asc',
        defaultOrderBy: 'startDate'
    });

    const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

    const userRole = useMemo(() => userLogged?.data?.user_role?.name, [userLogged]);

    const router = useRouter();

    const confirm = useBoolean();

    const defaultView = useMemo(
        () => isClient(userRole) ? 'grid' :
            localStorage.getItem('itemView') || 'list',
        [userRole]
    );

    const [view, setView] = useState(defaultView);

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (refetchAllRewardItems) {
            refetchAllRewardItems();
        }
        if (userRole === 'client') {
            setTableData(loadedFilteredRewardItems || []);
        }
        else {
            setTableData(loadedAllRewardItems || []);
        }
    }, [refetchAllRewardItems, loadedAllRewardItems, loadedFilteredRewardItems, userRole]);

    useEffect(() => {
        if (loadedFilteredRewardItems && loadedFilteredRewardItems.length > 0 && userRole === 'client') {
            setTableData(loadedFilteredRewardItems);
        }
        else if (loadedAllRewardItems && loadedAllRewardItems.length > 0 && userRole !== 'client') {
            setTableData(loadedAllRewardItems);
        }
    }, [loadedAllRewardItems, loadedFilteredRewardItems, userRole]);

    const filters = useSetState({
        name: localStorage.getItem('itemFilterName') || '',
    });
    
    const dateError = false;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
        dateError,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const canReset =
        !!filters.state.name

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleChangeView = useCallback((event, newView) => {
        if (newView !== null) {
            localStorage.setItem('itemView', newView);
            localStorage.removeItem('itemReminderTab');
            setView(newView);
        }
    }, []);

    const handleDeleteItem = useCallback(
        async (id) => {

            const promise = axiosInstanceBackend.delete(endpoints.item.delete.item(id), {
                data: {
                    userReporter: userLogged?.data,
                }
            });


            const deleteRow = tableData.filter((row) => row.id !== id);

            toast.success('Delete success!');

            await promise;

            setTableData(deleteRow);

            refetchAllRewardItems?.();

            table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [dataInPage.length, table, tableData, refetchAllRewardItems, userLogged]
    );

    const handleDeleteItems = useCallback(
        async () => {
            const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

            const promise = axiosInstanceBackend.delete(endpoints.item.delete.list, {
                data: {
                    ids: table.selected,
                    userReporter: userLogged?.data,
                },
            });


            toast.success('Delete success!');

            await promise;

            setTableData(deleteRows);

            refetchAllRewardItems?.();

            table.onUpdatePageDeleteRows({
                totalRowsInPage: dataInPage.length,
                totalRowsFiltered: dataFiltered.length,
            });
        }, [dataFiltered.length, dataInPage.length, table, tableData, refetchAllRewardItems, userLogged]);

    const handleDetailsView = useCallback(
        (id) => {
            localStorage.setItem('projectId', id);
            localStorage.setItem('backFromProjectDetails', 'projects');
            const listData = dataFiltered.map((item) => ({
                id: item.id,
                name: item.name,
                number: item.number,
                startDate: item.startDate,
            }));
            localStorage.setItem('installationFilteredList', JSON.stringify(listData));
            router.push(paths.dashboard.project.details(id));
        },
        [router, dataFiltered]
    );

    const renderFilters = (
        <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            sx={{ width: 1, mb: 0 }}
        >
            <ItemFilters
                filters={filters}
                // loadedUsers={loadedUsers}
                dateError={dateError}
                onResetPage={table.onResetPage}
            // openDateRange={openDateRange.value}
            // onOpenDateRange={openDateRange.onTrue}
            // onCloseDateRange={openDateRange.onFalse}
            // openInstallerFilter={openInstallerFilter.value}
            // onOpenInstallerFilter={openInstallerFilter.onTrue}
            // onCloseInstallerFilter={openInstallerFilter.onFalse}
            // options={{ types: PROJECT_TYPE_OPTIONS }}
            />


            {!isClient(userRole) && (
                <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
                    <ToggleButton value="list">
                        <Iconify icon="solar:list-bold" />
                    </ToggleButton>

                    <ToggleButton value="grid">
                        <Iconify icon="mingcute:dot-grid-fill" />
                    </ToggleButton>

                </ToggleButtonGroup>
            )}

        </Stack>
    );

    const renderResults = (
        <ItemFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
        />
    );

    const [titleLinearProgress, setTitleLinearProgress] = useState('Loading items data...');

    return (
        <>
            {
                (loadingAllRewardItems) ? (
                    <Box
                        sx={{
                            width: '350px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '80vh',
                            margin: 'auto'
                        }}
                    >
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            {titleLinearProgress}
                        </Typography>
                        <LinearProgress
                            key="error"
                            sx={{
                                mb: 2,
                                width: '100%',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: 'black',
                                },
                                backgroundColor: '#e0e0e0',
                            }}
                        />
                    </Box>
                ) : (
                    <>
                        <DashboardContent>

                            <Stack spacing={2.5} sx={{ my: { xs: 3, md: 3 } }}>
                                {renderFilters}

                                {canReset && renderResults}
                            </Stack>

                            {notFound ? (
                                <EmptyContent filled sx={{ py: 10 }} />
                            ) : (
                                <>
                                    {view === 'list' ? (
                                        <ItemTable
                                            table={table}
                                            dataFiltered={dataFiltered}
                                            onDeleteRow={handleDeleteItem}
                                            onViewRow={handleDetailsView}
                                            notFound={notFound}
                                            onOpenConfirm={confirm.onTrue}
                                            setTableData={setTableData}
                                            refetchAllRewardItems={refetchAllRewardItems}
                                            loadedAllRewardItems={loadedAllRewardItems}
                                            canReset={canReset}
                                        />
                                    ) : (
                                        <ItemGridView
                                            table={table}
                                            dataFiltered={dataFiltered}
                                            onDeleteItem={handleDeleteItem}
                                            onViewRow={handleDetailsView}
                                            onOpenConfirm={confirm.onTrue}
                                            setTableData={setTableData}
                                            refetchAllRewardItems={refetchAllRewardItems}
                                        />
                                    )}
                                </>
                            )}
                        </DashboardContent>

                        <ConfirmDialog
                            open={confirm.value}
                            onClose={confirm.onFalse}
                            title="Delete"
                            content={
                                <>
                                    Are you sure want to delete <strong> {table.selected.length} </strong> item(s)?
                                </>
                            }
                            action={
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        handleDeleteItems();
                                        confirm.onFalse();
                                    }}
                                >
                                    Delete
                                </Button>
                            }
                        />
                    </>
                )}
        </>
    );
}

function applyFilter({ inputData, comparator, filters }) {
    const {
        // list, 
        name,
        // type, 
        // startDate, 
        // endDate, 
        // installer, 
        // custom 
    } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    // if (list) {
    //     if (list === 'in progress') {
    //         inputData = inputData.filter((file) => file.currentStage?.name?.toLowerCase().indexOf(CONFIG.stages.finished.toLowerCase()) === -1);
    //     }
    //     else if (list === 'finished') {
    //         inputData = inputData.filter((file) => file.currentStage?.name?.toLowerCase().indexOf(CONFIG.stages.finished.toLowerCase()) !== -1);
    //     }
    // }

    if (name) {
        inputData = inputData?.filter(
            (file) => file?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                file?.number?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                file?.salesOrder?.salesorder_id?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                file?.salesOrder?.salesorder_number?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                file?.salesOrder?.customer_id?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                file?.salesOrder?.customer_name?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                file?.address?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                JSON.stringify(file?.userManager)?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                JSON.stringify(file?.usersAssignees)?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                JSON.stringify(file?.currentStage)?.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    // if (type && type.length > 0) {
    //     const statusFilters = type.filter(t => t === 'active' || t === 'inactive');
    //     const stageFilters = type.filter(t => t !== 'active' && t !== 'inactive');

    //     if (statusFilters.length === 1) {
    //         if (statusFilters[0] === 'active') {
    //             inputData = inputData.filter(file => file.isActive);
    //         } else if (statusFilters[0] === 'inactive') {
    //             inputData = inputData.filter(file => !file.isActive);
    //         }
    //     }

    //     if (stageFilters.length > 0) {
    //         const normalizedStageFilters = stageFilters.map(stage => stage.toLowerCase());
    //         inputData = inputData.filter(file => {
    //             if (file.currentStage && file.currentStage.name) {
    //                 return normalizedStageFilters.includes(file.currentStage?.name?.toLowerCase());
    //             }
    //             return false;
    //         });
    //     }
    // }

    // if (installer.id) {
    //     inputData = inputData.filter((file) => {
    //         const installerId = getProjectInstaller(file, CONFIG)?.id;
    //         if (installerId) {
    //             return String(installerId) === String(installer.id);
    //         }
    //         return false;
    //     });
    // }

    // if (custom.hasPermission) {
    //     inputData = inputData.filter(file => file.hasPermission);
    // }

    // if (custom.hasComments) {
    //     inputData = inputData.filter(file => file?.projectComments?.length > 0);
    // }

    // if (!dateError) {
    //     if (startDate && endDate) {
    //         inputData = inputData.filter((file) => fIsBetween(file.startDate, startDate, endDate));
    //     }
    // }

    // if (custom.isPreparation.value || custom.isCoordination.value || custom.isInstallation.value || custom.isPermission.value || custom.isClosing.value) {
    //     inputData = inputData.filter(file => {
    //         const { currentStage } = file;
    //         if (currentStage && currentStage.name) {
    //             if (custom.isPreparation.value && currentStage?.name?.toLowerCase().indexOf(custom.isPreparation.name.toLowerCase()) !== -1) {
    //                 return true;
    //             }
    //             if (custom.isCoordination.value && currentStage?.name?.toLowerCase().indexOf(custom.isCoordination.name.toLowerCase()) !== -1) {
    //                 return true;
    //             }
    //             if (custom.isInstallation.value && currentStage?.name?.toLowerCase().indexOf(custom.isInstallation.name.toLowerCase()) !== -1) {
    //                 return true;
    //             }
    //             if (custom.isPermission.value && currentStage?.name?.toLowerCase().indexOf(custom.isPermission.name.toLowerCase()) !== -1) {
    //                 return true;
    //             }
    //             if (custom.isClosing.value && currentStage?.name?.toLowerCase().indexOf(custom.isClosing.name.toLowerCase()) !== -1) {
    //                 return true;
    //             }
    //         }
    //         return false;
    //     });
    // }


    return inputData;
}
