import { z as zod } from 'zod';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Typography, LinearProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResendTimer } from 'src/hooks/use-resend-timer';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Form } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { LoadingContext } from 'src/auth/context/loading-context';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { VerificationCodeInput } from './verification-code-input';


// ----------------------------------------------------------------------

export const VerificationCodeSchema = zod.object({
    verificationCode: zod.string().min(1, 'Verification code is required'),
});

// ----------------------------------------------------------------------

export function VerificationCodeView() {

    const userSignedUp = JSON.parse(sessionStorage.getItem('userSignedUp'));

    const { isMobile } = useContext(LoadingContext);

    const { checkUserSession } = useAuthContext();

    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState({
        message: '',
        name: '',
    });

    const isSending = useBoolean(false);

    const [titleIsSending, setTitleIsSending] = useState('');

    const { remaining: resendTimer, canResend, start } = useResendTimer();

    const confirmSignIn = useBoolean(false);

    const defaultValues = {
        verificationCode: '',
    };

    const methods = useForm({
        resolver: zodResolver(VerificationCodeSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
    } = methods;

    const value = watch('verificationCode', '');

    const onSubmit = handleSubmit(async (data) => {
        setTitleIsSending('Verifying...');
        isSending.onTrue();
        try {
            const payload = {
                code: data.verificationCode,
                username: userSignedUp?.data?.username,
            };
            const resp = await axiosInstanceBackend.post(endpoints.auth.verifyUser, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            if (resp.status === 200) {
                await checkUserSession?.();
                confirmSignIn.onTrue();
                setValue('verificationCode', '');
            } else {
                throw new Error('Failed to resend verification code');
            }

        } catch (error) {
            console.error(error);
            setErrorMsg({
                message: typeof error === 'string' ? error : error.response.data.description,
                name: error.error_name || '',
            });
        } finally {
            setTitleIsSending('');
            isSending.onFalse();
        }
    });

    const handleResendCode = async () => {
        console.log('Resend verification code');
        setTitleIsSending('Resending verification code...');
        isSending.onTrue();
        try {
            const payload = {
                email: sessionStorage.getItem('userSignedUpEmail'),
                username: userSignedUp?.data?.username,
            }
            const resp = await axiosInstanceBackend.post(endpoints.auth.sendVerificationCode, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            if (resp.status === 200) {
                router.refresh();
            } else {
                throw new Error('Failed to resend verification code');
            }
        }
        catch (error) {
            console.error('Error resending verification code:', error);
            setErrorMsg({
                message: typeof error === 'string' ? error : error.response.data.description,
                name: error.error_name || '',
                email: error.error_email || '',
            });
        }
        finally {
            setTitleIsSending('');
            isSending.onFalse();
        }
    }

    const renderForm = (
        <Box gap={3} display="flex" flexDirection="column">

            {/* <Field.Phone name="phoneNumber" label="Phone or Mobile" InputLabelProps={{ shrink: true }} /> */}

            <Controller
                name="verificationCode"
                control={methods.control}
                render={({ field }) => (
                    <VerificationCodeInput value={field.value} onChange={field.onChange} />
                )}
            />

            <Box gap={3} display="flex" flexDirection="row">

                <LoadingButton
                    fullWidth
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    loadingIndicator="Verifying..."
                    disabled={isSubmitting || !(value.length === 6)}
                >
                    Verify
                </LoadingButton>

                <Button
                    fullWidth
                    color="warning"
                    size="large"
                    variant="outlined"
                    onClick={() => {
                        start();
                        handleResendCode();
                    }}
                    disabled={!canResend}
                >
                    {canResend
                        ? 'Resend code'
                        : `Resend code (${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, '0')})`}
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            {isSending.value ? (
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
                        {titleIsSending || 'Please wait...'}
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
                <Box sx={{
                    mt: !isMobile ? 0 : 35,
                }}>
                    <FormHead
                        title="Verification Code"
                        isCompound
                        description={
                            <Box variant="body2" sx={{ color: 'text.secondary' }}>
                                    {`Please enter the verification code for user: `}
                                    <strong>{userSignedUp?.data?.username}</strong>
                                    {` sent to your `}
                                    {`${sessionStorage.getItem('isNewUserSignedUp') === 'true' ? '' : 'existing'}`}
                                    {` email address: `}
                                    <strong>{sessionStorage.getItem('userSignedUpEmail')}</strong>
                                    <Alert severity="info" sx={{ mt: 2, fontSize: '0.75rem' }}>
                                        <Box component="span">
                                            {`If you do not receive the code, please check your spam folder or click on "Resend code".`}
                                            <br />
                                            <strong>Note:</strong> This code is valid for 10 minutes.
                                        </Box>
                                    </Alert>
                                    <br />
                                    <br />
                                    {`Already have an account? `}
                                    <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
                                        Sign in
                                    </Link>
                                </Box>
                        }
                        sx={{ textAlign: { xs: 'center', md: 'left' } }}
                    />

                    {!!errorMsg.message && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {errorMsg.message}
                            </Typography>
                        </Alert>
                    )}

                    <Form methods={methods} onSubmit={onSubmit}>
                        {renderForm}
                    </Form>

                    {/* <SignUpTerms /> */}
                </Box>
            )}
            <ConfirmDialog
                open={confirmSignIn.value}
                onClose={() => {
                    confirmSignIn.onFalse();
                    router.push(paths.auth.jwt.signIn);
                }}
                title="Proceed to Sign In..."
                maxWidth="xs"
                content={
                    <Typography variant="body2">
                        Your code has been verified successfully. You can now proceed to sign in with your account.
                    </Typography>
                }
            />

        </>
    );
}
