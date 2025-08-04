import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import { Box, Typography, LinearProgress } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { isClient } from 'src/utils/check-permissions';
import { endpoints, wsEndpoints, axiosInstanceBackend } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';

import { LoadingContext } from 'src/auth/context/loading-context';
import { useDataContext } from 'src/auth/context/data/data-context';

import { StoreProductTable } from '../store-product-table';
import { StoreProductFilters } from '../store-product-filters';
import { StoreProductGridView } from '../store-product-grid-view';
import { StoreProductFiltersResult } from '../store-product-filters-result';

// ----------------------------------------------------------------------

export function StoreProductView() {

    const { isMobile } = useContext(LoadingContext);

    localStorage.setItem('backFromStoreProductDetails', 'storeProducts');

    const {
        loadedStoreProducts,
        refetchStoreProducts,
        loadingStoreProducts,
        refetchStoreProductSelectionCarts,
    } = useDataContext();

    // console.log('loadedFilteredRewardItems', loadedFilteredRewardItems);

    const table = useTable({
        defaultCurrentPage: parseInt(localStorage.getItem('storeProductPage'), 10) || 0,
        defaultRowsPerPage: parseInt(localStorage.getItem('storeProductRowsPerPage'), 10) || 10,
        defaultDense: true,
        defaultOrder: 'asc',
        defaultOrderBy: 'name'
    });

    const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

    const userRole = useMemo(() => userLogged?.data?.user_role?.name, [userLogged]);

    const router = useRouter();

    const confirm = useBoolean();

    const defaultView = useMemo(
        () => isClient(userRole) ? 'grid' :
            localStorage.getItem('storeProductView') || 'list',
        [userRole]
    );

    const [view, setView] = useState(defaultView);

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (loadedStoreProducts && loadedStoreProducts?.length > 0) {
            setTableData(
                !isClient(userRole) ?
                    loadedStoreProducts :
                    loadedStoreProducts.filter((item) => item.isActive)
            );
        }
    }, [loadedStoreProducts, userRole]);

    useEffect(() => {
        const socket = new WebSocket(wsEndpoints.rewardPoints.storeProduct.all);
        socket.onerror = (errorEvent) => {
            console.dir(errorEvent);
            console.error('WebSocket error (toString):', errorEvent.toString());
        };
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'created' || message.type === 'updated' || message.type === 'deleted') {
                refetchStoreProducts?.()
                    .catch((error) => {
                        console.error('Error refetching store products:', error);
                    });
            }
        };
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [userLogged?.data?.user_role?.name, userLogged?.data?.username, refetchStoreProducts]);

    const filters = useSetState({
        // list: localStorage.getItem('projectFilterList') || 'in progress',
        name: localStorage.getItem('storeProductFilterName') || '',
        // type: JSON.parse(localStorage.getItem('projectFilterType')) || [],
        // startDate: localStorage.getItem('projectFilterStartDate') ? dayjs(localStorage.getItem('projectFilterStartDate')) : null,
        // endDate: localStorage.getItem('projectFilterEndDate') ? dayjs(localStorage.getItem('projectFilterEndDate')) : null,
        // installer: JSON.parse(localStorage.getItem('projectFilterInstaller')) || {
        //     id: null,
        //     name: null,
        // },
        // custom: JSON.parse(localStorage.getItem('projectFilterCustom')) || {
        //     hasPermission: false,
        //     isPreparation: {
        //         name: 'preparation',
        //         value: false,
        //     },
        //     isCoordination: {
        //         name: 'coordination',
        //         value: false,
        //     },
        //     isInstallation: {
        //         name: 'installation',
        //         value: false,
        //     },
        //     isPermission: {
        //         name: 'permission',
        //         value: false,
        //     },
        //     isClosing: {
        //         name: 'closing',
        //         value: false,
        //     },
        //     hasComments: false,
        // }
    });

    // const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
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
    // ||
    // filters.state.type.length > 0 ||
    // (!!filters.state.startDate && !!filters.state.endDate) ||
    // filters.state.custom.hasPermission ||
    // filters.state.custom.isPreparation?.value ||
    // filters.state.custom.isCoordination?.value ||
    // filters.state.custom.isInstallation?.value ||
    // filters.state.custom.isPermission?.value ||
    // filters.state.custom.isClosing?.value ||
    // filters.state.custom.hasComments ||
    // (!!filters.state.installer.id && !!filters.state.installer.name)

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
            try {
                const promise = await axiosInstanceBackend.delete(endpoints.rewardPoints.delete.storeProduct.item(id), {
                    data: {
                        userReporter: JSON.stringify(userLogged?.data),
                    }
                });
                if (promise.status > 204) {
                    toast.error('Error deleting store product. Please try again.');
                }
                else {
                    const deleteRow = tableData.filter((row) => row.id !== id);
                    toast.success('Delete success!');
                    setTableData(deleteRow);
                    refetchStoreProducts?.();
                }

            } catch (error) {
                console.error('Error deleting store product:', error);
                toast.error(error?.response?.data?.error || 'Error deleting store product');
            } finally {
                table.onUpdatePageDeleteRow(dataInPage.length);
            }
        },
        [dataInPage.length, table, tableData, refetchStoreProducts, userLogged]
    );

    const handleDeleteItems = useCallback(
        async () => {
            try {
                const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
                await axiosInstanceBackend.delete(endpoints.rewardPoints.delete.storeProduct.list, {
                    data: {
                        ids: table.selected,
                        userReporter: JSON.stringify(userLogged?.data),
                    },
                });
                toast.success('Delete success!');
                setTableData(deleteRows);
                refetchStoreProducts?.();
                table.onUpdatePageDeleteRows({
                    totalRowsInPage: dataInPage.length,
                    totalRowsFiltered: dataFiltered.length,
                });
            } catch (error) {
                console.error('Error deleting store products:', error);
                toast.error(error?.response?.data?.error || 'Error deleting store products');
            }
        }, [refetchStoreProducts, table, tableData, dataInPage.length, dataFiltered.length, userLogged]);

    const handleDetailsView = useCallback(
        (id) => {
            localStorage.setItem('storeProductId', id);
            localStorage.setItem('backFromStoreProductDetails', 'storeProducts');
            router.push(paths.dashboard.storeProduct.details(id));
        },
        [router]
    );

    const handleEditView = useCallback(
        (id) => {
            localStorage.setItem('storeProductId', id);
            localStorage.setItem('backFromStoreProductDetails', 'storeProducts');
            const listData = dataFiltered.map((item) => ({
                id: item.id,
                name: item.name,
                // number: item.number,
                // startDate: item.startDate,
            }));
            localStorage.setItem('storeProductFilteredList', JSON.stringify(listData));
            router.push(paths.dashboard.storeProduct.edit(id));
        },
        [router, dataFiltered]
    );

    const handleManageActiveItem = useCallback(
        async (id) => {
            try {
                const promise = await axiosInstanceBackend.post(
                    endpoints.rewardPoints.manageActive.storeProduct.item(id),
                    {
                        userReporter: JSON.stringify(userLogged?.data),
                    });
                if (promise.status > 204) {
                    toast.error('Error managing store product. Please try again.');
                }
                else {
                    toast.success('Manage success!');
                    refetchStoreProducts?.();
                    refetchStoreProductSelectionCarts?.();
                }

            } catch (error) {
                console.error('Error managing store product:', error);
                toast.error(error?.response?.data?.error || 'Error managing store product');
            }
        },
        [
            refetchStoreProducts,
            userLogged,
            refetchStoreProductSelectionCarts
        ]
    );

    const renderFilters = (
        <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            sx={{ width: 1, mb: 0 }}
        >
            <StoreProductFilters
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
                <Box sx={{
                    display: 'flex',
                    alignItems: 'right',
                    justifyContent: 'flex-end',
                    alignContent: 'right',
                    gap: 1,
                    flexDirection: { xs: 'column', md: 'row' },
                    width: 1
                }}
                >
                    <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
                        <ToggleButton value="list">
                            <Iconify icon="solar:list-bold" />
                        </ToggleButton>

                        <ToggleButton value="grid">
                            <Iconify icon="mingcute:dot-grid-fill" />
                        </ToggleButton>

                    </ToggleButtonGroup>
                    <Box sx={{
                        alignItems: 'right',
                        justifyContent: 'flex-end',
                        mt: 0.5
                    }}>
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.storeProduct.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            New store product
                        </Button>
                    </Box>
                </Box>
            )}

        </Stack>
    );

    const renderResults = (
        <StoreProductFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
        />
    );

    const [titleLinearProgress, setTitleLinearProgress] = useState('Loading store products data...');

    return (
        <>
            {
                (loadingStoreProducts) ? (
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
                                        <StoreProductTable
                                            table={table}
                                            dataFiltered={dataFiltered}
                                            onDeleteRow={handleDeleteItem}
                                            onViewRow={handleDetailsView}
                                            onEditRow={handleEditView}
                                            onManageActiveRow={handleManageActiveItem}
                                            notFound={notFound}
                                            onOpenConfirm={confirm.onTrue}
                                            setTableData={setTableData}
                                            refetchStoreProducts={refetchStoreProducts}
                                            loadedStoreProducts={loadedStoreProducts}
                                            canReset={canReset}
                                        />
                                    ) : (
                                        <StoreProductGridView
                                            table={table}
                                            dataFiltered={dataFiltered}
                                            onDeleteItem={handleDeleteItem}
                                            onViewRow={handleDetailsView}
                                            onEditRow={handleEditView}
                                            onManageActiveRow={handleManageActiveItem}
                                            onOpenConfirm={confirm.onTrue}
                                            setTableData={setTableData}
                                            refetchStoreProducts={refetchStoreProducts}
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
                file?.assignedPoints?.toString()?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                file?.description?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                JSON.stringify(file?.attachments)?.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
