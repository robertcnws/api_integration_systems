import React, { useMemo, useContext } from 'react';

import { Box, Table, TableRow, TableBody, TableCell, TableHead, Typography, TableFooter, TableContainer } from "@mui/material";

import { fNumber } from "src/utils/format-number";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";

import { LoadingContext } from "src/auth/context/loading-context";

import { StoreProductFolderItemCarousel } from "./store-product-folder-item-carousel";

export function StoreProductConfirmCheckoutTable({ listMappedProducts }) {

    const { isMobile } = useContext(LoadingContext);

    const TABLE_HEAD_OPTIONS = [
        ...!isMobile ? [
            { id: 'image', label: 'Image', align: 'left' },
            { id: 'product', label: 'Product', align: 'left' },
            { id: 'points', label: 'Points', align: 'left' },
            { id: 'qty', label: 'Qty', align: 'left' },
            { id: 'subtotal', label: 'Subtotal', align: 'left' },
        ] : [
            { id: 'info', label: 'INFO', align: 'left' },
        ],

    ];

    const totalPoints = useMemo(
        () => listMappedProducts.reduce((acc, p) => acc + (p.assignedPoints * p.quantity || 0), 0),
        [listMappedProducts]
    );

    return (
        <TableContainer sx={{ minWidth: '100%', mt: 1 }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ p: 0 }}>
                        {TABLE_HEAD_OPTIONS.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                align={headCell.align}
                                sx={{ p: 0, fontWeight: 'fontWeightBold', textTransform: 'uppercase' }}
                            >
                                {headCell.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listMappedProducts.map((p, index) => (
                        <React.Fragment key={`${p.id}-${index}-fragment`}>
                            {!isMobile ? (
                                <TableRow key={`${p.id}-${index}`} sx={{ p: 0 }}>
                                    <TableCell sx={{ p: 0 }}>
                                        <StoreProductFolderItemCarousel
                                            images={p?.attachments || []}
                                            maxWidth={50}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ p: 0 }}>
                                        <Typography variant="subtitle2" sx={{ mt: -2 }}>
                                        {p?.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ p: 0 }}>
                                        <Label color="success" sx={{ alignItems: 'center', mt: -2 }}>
                                            <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                                            {fNumber(p?.assignedPoints) || 0}
                                        </Label>
                                    </TableCell>
                                    <TableCell sx={{ p: 0 }}>
                                        <Typography variant="subtitle2" sx={{ mt: -1 }}>
                                            x{p.quantity}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ p: 0 }}>
                                        <Label color="info" sx={{ alignItems: 'center', mt: -2 }}>
                                            <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                                            {fNumber(p.assignedPoints * p.quantity) || 0}
                                        </Label>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow key={`${p.id}-${index}`} sx={{ p: 0 }}>
                                    <TableCell sx={{ p: 0 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 0 }}>
                                                <StoreProductFolderItemCarousel
                                                    images={p?.attachments || []}
                                                    maxWidth={50}
                                                />
                                                <Typography variant="subtitle2" sx={{ ml: 1, mt: -3 }}>
                                                    <strong>{p?.name}</strong>
                                                </Typography>
                                            </Box>

                                            <Box
                                                rowGap={3}
                                                columnGap={0}
                                                display="grid"
                                                gridTemplateColumns={{
                                                    xs: 'repeat(2, 1fr)',
                                                    sm: 'repeat(2, 1fr)',
                                                }}
                                            >
                                                <Typography variant="subtitle2" sx={{ ml: 1, mt: -3 }}>
                                                    <strong>Points</strong>
                                                </Typography>
                                                <Box sx={{ mt: -3 }}>
                                                    <Label color="success" sx={{ alignItems: 'center' }}>
                                                        <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                                                        {fNumber(p?.assignedPoints) || 0}
                                                    </Label>
                                                </Box>
                                                <Typography variant="subtitle2" sx={{ ml: 1, mt: -3 }}>
                                                    <strong>Qty</strong>
                                                </Typography>
                                                <Box sx={{ mt: -3 }}>
                                                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                                                        x{p.quantity}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="subtitle2" sx={{ ml: 1, mt: -3 }}>
                                                    <strong>TOTAL</strong>
                                                </Typography>
                                                <Box sx={{ mt: -3 }}>
                                                    <Label color="info" sx={{ alignItems: 'center' }}>
                                                        <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                                                        {fNumber(p.assignedPoints * p.quantity) || 0}
                                                    </Label>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
                {!isMobile ? (
                    <TableFooter sx={{ display: 'table-row-group' }}>
                        <TableRow>
                            <TableCell colSpan={4} align="right" sx={{ p: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: -1 }}>
                                    <strong>Subtotal:</strong>
                                </Typography>
                            </TableCell>
                            <TableCell align="left" sx={{ p: 0 }}>
                                <Label color="info" sx={{ alignItems: 'center', mt: -1 }}>
                                    <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                                    {fNumber(totalPoints) || 0}
                                </Label>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                ) : (
                    <TableFooter sx={{ display: 'table-row-group' }}>
                        <TableRow>
                            <TableCell colSpan={1} align="right" sx={{ p: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 0 }}>
                                    <strong>Subtotal:</strong>
                                </Typography>
                                <Label color="info" sx={{ alignItems: 'center', mt: 0 }}>
                                    <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                                    <p>{fNumber(totalPoints) || 0}</p>
                                </Label>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </TableContainer>
    )
}