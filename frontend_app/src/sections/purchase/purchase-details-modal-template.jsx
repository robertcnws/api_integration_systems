import { Box, Card, Divider, Tooltip, IconButton, Typography } from "@mui/material";

import { fNumber } from "src/utils/format-number";
import { fDateTime } from "src/utils/format-time";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";

import { StoreProductDetailsCarousel } from "../store-product/store-product-details-carousel";

export function PurchaseDetailsModalTemplate({
    currentBuy,
    isMobile,
    assignedPoints,
    quantity,
    roleName,
    handleNavigateClient
}) {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: !isMobile ? 'row' : 'column',
            alignItems: 'center',
            mb: 2,
            gap: 2,
            width: '100%',
            height: '100%',
        }}>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '100%',
                p: 0,

            }}>
                <StoreProductDetailsCarousel
                    images={currentBuy?.storeProductSelection?.storeProduct?.attachments}
                    forceSize
                    predefinedSize={100}
                />

            </Box>

            <Box sx={{
                display: isMobile ? 'block' : 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 2,
                width: '100%',
                alignItems: 'stretch',
            }}>
                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: '100%',
                        height: '100%',
                        p: 2,
                    }}
                    ml={{ xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }}
                    mr={{ xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }}
                    width={{ xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '100%' }}
                >
                    <Box
                        display="flex"
                        flexDirection='row'
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                    >
                        <Label color="default" sx={{ width: '100%', justifyContent: 'flex-start' }} variant="none">
                            <b>PRODUCT:</b>
                        </Label>
                        <Typography variant="body2" sx={{ width: '100%' }}>
                            {currentBuy?.storeProductSelection?.storeProduct?.name || 'N/A'}
                        </Typography>
                    </Box>
                    {roleName !== 'client' && (
                        <Box
                            display="flex"
                            flexDirection='row'
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                        >
                            <Label color="default" sx={{ width: '100%', justifyContent: 'flex-start' }} variant="none">
                                <b>CLIENT NAME:</b>
                            </Label>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ width: '100%' }}>
                                    {currentBuy?.storeProductSelection?.user?.firstName} {currentBuy?.storeProductSelection?.user?.lastName}
                                </Typography>
                                <Tooltip title="Navigate to client details" arrow>
                                    <IconButton sx={{ mt: -1 }} onClick={handleNavigateClient}>
                                        <Iconify
                                            icon="streamline-sharp:link-share-2-remix"
                                            width={20}
                                            height={20}
                                            sx={{
                                                cursor: 'pointer', color: currentBuy?.hasBeenUsed ? 'error.main' :
                                                    currentBuy?.hasRequestedRefund ? 'secondary.main' :
                                                        'info.main'
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    )}
                    <Box
                        display="flex"
                        flexDirection='row'
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                    >
                        <Label color="default" sx={{ width: '100%', justifyContent: 'flex-start' }} variant="none">
                            <b>CREATED AT:</b>
                        </Label>
                        <Typography variant="body2" sx={{ width: '100%' }}>
                            {fDateTime(currentBuy?.createdTime) || 'N/A'}
                        </Typography>
                    </Box>
                    {currentBuy?.hasBeenUsed && (
                        <Box
                            display="flex"
                            flexDirection='row'
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                        >
                            <Label color="default" sx={{ width: '100%', justifyContent: 'flex-start' }} variant="none">
                                <b>REDEEMED AT:</b>
                            </Label>
                            <Typography variant="body2" sx={{ width: '100%' }}>
                                {fDateTime(currentBuy?.redeemedTime) || 'N/A'}
                            </Typography>
                        </Box>
                    )}
                    {currentBuy?.expirationTime && (
                        <Box
                            display="flex"
                            flexDirection='row'
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                        >
                            <Label color="default" sx={{ width: '100%', justifyContent: 'flex-start' }} variant="none">
                                <b>EXPIRATION AT:</b>
                            </Label>
                            <Typography variant="body2" sx={{ width: '100%' }}>
                                {fDateTime(currentBuy?.expirationTime) || 'N/A'}<br />
                            </Typography>
                        </Box>
                    )}
                </Card>

                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: '100%',
                        height: '100%',
                        p: 2,
                    }}
                    ml={{ xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }}
                    mr={{ xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }}
                    width={{ xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '100%' }}
                >

                    <Box
                        display="flex"
                        flexDirection='row'
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                    >
                        <Label color="default" sx={{ width: '100%', justifyContent: 'flex-start' }} variant="none">
                            <b>CONFIRMATION #:</b>
                        </Label>
                        <Typography
                            variant="body2"
                            sx={{
                                width: '100%',
                                fontFamily: 'monospace',
                                fontSize: 17,
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                alignSelf: 'flex-start',
                                display: 'inline-flex',
                                ml: !isMobile ? -4 : 0,
                            }}
                        >
                            {currentBuy?.confirmationNumber || 'N/A'}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection='row'
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                    >
                        <Label color="default" sx={{ width: '100%', justifyContent: 'flex-start' }} variant="none">
                            <b>PIN #:</b>
                        </Label>
                        <Typography
                            variant="body2"
                            sx={{
                                width: '100%',
                                fontSize: 17,
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                alignSelf: 'flex-start',
                                display: 'inline-flex',
                                ml: !isMobile ? -4 : 0,
                            }}
                        >
                            {currentBuy?.pinNumber || 'N/A'}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection='row'
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                    >
                        <Label color="default" sx={{ width: '100%', justifyContent: 'flex-start' }} variant="none">
                            <b>ORDER:</b>
                        </Label>
                        <Typography
                            variant="body2"
                            sx={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                alignSelf: 'flex-start',
                                display: 'inline-flex',
                                ml: !isMobile ? -4 : 0,
                            }}
                        >
                            {`No. ${currentBuy?.orderNumber || 'N/A'}`}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection='row'
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                    >
                        <Label
                            color="default"
                            sx={{
                                width: !isMobile ? '41%' : '46%',
                                justifyContent: 'flex-start'
                            }}
                            variant="none"
                        >
                            <b>STATUS:</b>
                        </Label>
                        <Label
                            variant="soft"
                            color={
                                (currentBuy?.hasBeenUsed && currentBuy?.quantityUsed === quantity && 'error') ||
                                (currentBuy?.hasBeenUsed && currentBuy?.quantityUsed !== 0 && currentBuy?.quantityUsed < quantity && 'warning') ||
                                (!currentBuy?.hasBeenUsed && 'info') ||
                                'default'
                            }
                            sx={{
                                display: 'inline-flex',
                                px: 1,
                                width: 'auto',
                                justifyContent: 'flex-start',
                            }}>
                            {
                                (currentBuy?.hasBeenUsed && currentBuy?.quantityUsed === quantity) ? 'Used' :
                                    (currentBuy?.hasBeenUsed && currentBuy?.quantityUsed !== 0 && currentBuy?.quantityUsed < quantity) ? 'Partially Used' :
                                        'Not Used'
                            }
                        </Label>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                        display="flex"
                        flexDirection='row'
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
                    >
                        <Label
                            color="default"
                            sx={{ width: !isMobile ? '41%' : '46%', justifyContent: 'flex-start' }}
                            variant="none"
                        >
                            <b>ASSIGNED POINTS:</b>
                        </Label>
                        <Label color="success" sx={{
                            display: 'inline-flex',
                            px: 1,
                            width: 'auto',
                            justifyContent: 'flex-start',
                        }}>
                            <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                            {fNumber(assignedPoints) || 0}
                        </Label>
                    </Box>
                    {currentBuy?.notes && currentBuy?.notes !== '' && (
                        <Box
                            display="flex"
                            flexDirection='row'
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{
                                width: '100%',
                                gap: !isMobile ? 3 : 1,
                                mt: 2,
                            }}
                        >
                            <Label
                                color="default"
                                sx={{
                                    width: '100%',
                                    justifyContent: 'flex-start'
                                }}
                                variant="none"
                            >
                                <b>NOTES:</b>
                            </Label>
                            <Typography
                                variant="caption"
                                sx={{
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    alignSelf: 'flex-start',
                                    display: 'inline-flex',
                                    ml: !isMobile ? -4 : 0,
                                }}
                            >
                                {currentBuy?.notes || 'N/A'}
                            </Typography>
                        </Box>
                    )}
                    {/* <Box
              display="flex"
              flexDirection='row'
              justifyContent="flex-start"
              alignItems="flex-start"
              sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
            >
              <Label color="default" sx={{ width: '54%' }}>
                <b>Total Quantity:</b>
              </Label>
              <Typography
                variant="subtitle2"
                sx={{
                  display: 'inline-flex',
                  px: 1,
                  width: '50%'
                }}>
                x{quantity || 0}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection='row'
              justifyContent="flex-start"
              alignItems="flex-start"
              sx={{ width: '100%', gap: !isMobile ? 3 : 1 }}
            >
              <Label color="default" sx={{ width: '50%' }}>
                <b>TOTAL Points:</b>
              </Label>
              <Label color="info" sx={{ width: 'auto' }}>
                <Iconify icon="streamline-cyber-color:bookmark-favorite-star" sx={{ mr: 0.5 }} />
                {fNumber(totalPoints) || 0}
              </Label>
            </Box> */}
                </Card>

            </Box>
        </Box>
    );
}