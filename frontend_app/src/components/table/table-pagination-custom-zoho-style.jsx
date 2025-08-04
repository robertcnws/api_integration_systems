import React, { useState, useContext } from 'react';

import Switch from '@mui/material/Switch';
import { Settings } from '@mui/icons-material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Box, Menu, Table, TableRow, MenuItem, TableCell, TableBody, IconButton, TableContainer, TablePagination } from '@mui/material';

import { LoadingContext } from 'src/auth/context/loading-context';

export const TableCustomPaginationZohoStyle = ({
    columnsLength,
    data,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    dense,
    onChangeDense
}) => {
    const { isMobile } = useContext(LoadingContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const absPage = page < 0 ? 0 : page;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        handleChangeRowsPerPage({ target: { value: newItemsPerPage } });
        handleMenuClose();
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={columnsLength} align="right" sx={{ borderBottom: 'none', paddingTop: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                                    {/* Contenedor para Typography e IconButton */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #dcdcdc',
                                        borderTopLeftRadius: '10px',
                                        borderBottomLeftRadius: '10px',
                                        // borderRadius: '4px', 
                                        padding: '0px',
                                        height: '48px',
                                        marginTop: '10px',
                                        marginBottom: '15px',
                                        backgroundColor: '#f7f7fe'
                                    }}>
                                        <IconButton
                                            onClick={handleMenuOpen}
                                            sx={{ color: 'gray', height: '100%' }}
                                        >
                                            <Settings />
                                            <span style={{ fontSize: '13px', marginLeft: '5px' }}>{rowsPerPage} Per page</span>
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={() => handleItemsPerPageChange(5)}>5 Per page</MenuItem>
                                            <MenuItem onClick={() => handleItemsPerPageChange(10)}>10 Per page</MenuItem>
                                            <MenuItem onClick={() => handleItemsPerPageChange(25)}>25 Per page</MenuItem>
                                            <MenuItem onClick={() => handleItemsPerPageChange(50)}>50 Per page</MenuItem>
                                        </Menu>
                                    </div>

                                    {/* Contenedor para TablePagination */}
                                    <div style={{
                                        border: '1px solid #dcdcdc',
                                        borderTopRightRadius: '10px',
                                        borderBottomRightRadius: '10px',
                                        padding: '0px',
                                        height: '48px',
                                        marginLeft: '-11px',
                                        marginTop: '10px',
                                        marginBottom: '15px',
                                    }}>
                                        <TablePagination
                                            rowsPerPageOptions={[]}
                                            component="div"
                                            count={data?.length}
                                            rowsPerPage={rowsPerPage}
                                            page={absPage}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={() => { }}
                                            labelRowsPerPage="Rows:"
                                        />
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {onChangeDense && (
                <FormControlLabel
                    label="Dense"
                    control={<Switch name="dense" checked={dense} onChange={onChangeDense} />}
                    sx={{
                        pl: 2,
                        py: 1,
                        top: !isMobile ? 0 : -25,
                        bottom: !isMobile ? 0 : -25,
                        position: { sm: 'absolute', xs: 'relative' },
                    }}
                />
            )}
        </Box>
    );
};


