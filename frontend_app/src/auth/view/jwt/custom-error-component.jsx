import { Box, Alert, Button, Typography } from "@mui/material";

import { useResendTimer } from "src/hooks/use-resend-timer";

export function CustomErrorComponent({ errorMsg, handleResendCode, actionName }) {

    const { remaining: resendTimer, canResend, start } = useResendTimer();

    return (
        <Box display="flex" flexDirection="row" alignItems="center" gap={1} sx={{ width: '100%' }}>
            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {errorMsg.message}
                </Typography>
            </Alert>
            {(errorMsg.name === 'username_not_verified' || errorMsg.name === 'user_not_verified') && (
                <Button
                    color="inherit"
                    variant="outlined"
                    sx={{ mt: -3 }}
                    onClick={() => {
                        start();
                        handleResendCode();
                    }}
                    disabled={!canResend}
                >
                    {canResend
                        ? `${actionName} code`
                        : `${actionName} code (${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, '0')})`}
                </Button>
            )}
        </Box>
    );
}