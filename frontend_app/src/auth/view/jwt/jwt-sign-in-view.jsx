import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { LoadingContext } from 'src/auth/context/loading-context';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { CustomErrorComponent } from './custom-error-component';
import { signInWithUsernameAndPassword } from '../../context/jwt';


// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  // email: zod
  //   .string()
  //   .min(1, { message: 'Email is required!' })
  //   .email({ message: 'Email must be a valid email address!' }),
  username: zod
    .string()
    .min(1, { message: 'Username is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(5, { message: 'Password must be at least 6 characters!' }),
  rememberMe: zod.boolean().optional(),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const { isMobile } = useContext(LoadingContext);

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState({
    message: '',
    name: '',
  });

  const password = useBoolean();

  const isSending = useBoolean(false);

  const [titleIsSending, setTitleIsSending] = useState('');

  const defaultValues = {
    // email: 'demo@minimals.cc',
    username: '',
    password: '',
    rememberMe: false,
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await signInWithPassword({ email: data.email, password: data.password });
      await signInWithUsernameAndPassword({ username: data.username, password: data.password, rememberMe: data.rememberMe });
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg({
        message: error.description || error.detail || 'An error occurred during sign in.',
        name: error.error_name || 'SignInError',
      });
      sessionStorage.setItem('userSignedInEmail', error.error_email);
      sessionStorage.setItem('userSignedInUsername', data.username);
    }
  });

  const handleResendCode = async () => {
    console.log('Resend verification code');
    setTitleIsSending('Resending verification code...');
    isSending.onTrue();
    try {
      const payload = {
        email: sessionStorage.getItem('userSignedInEmail'),
        username: sessionStorage.getItem('userSignedInUsername'),
      }
      const resp = await axiosInstanceBackend.post(endpoints.auth.sendVerificationCode, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (resp.status === 200) {
        router.push(paths.auth.jwt.verificationCode);
      } else {
        throw new Error('Failed to resend verification code');
      }
    }
    catch (error) {
      console.error('Error resending verification code:', error);
      setErrorMsg({
        message: typeof error === 'string' ? error : error.description,
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
      {/* <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} /> */}
      <Field.Text name="username" label="Username" InputLabelProps={{ shrink: true }} />

      <Box gap={1.5} display="flex" flexDirection="column">
        {/* <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link> */}

        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Field.Checkbox
          name="rememberMe"
          label={
            <span>
              Remember me
              {/* <Link component={RouterLink} href="#" variant="subtitle2" sx={{ ml: 1 }}>
                Terms of Service
              </Link> */}
            </span>
          }
          sx={{ alignSelf: 'flex-start' }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <Box sx={{
      mt: !isMobile ? 0 : 35,
    }}>
      <FormHead
        title="Sign in to your account"
        description={
          <>
            {`Don’t have an account? `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              Sign up
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use <strong>{defaultValues.email}</strong>
        {' with password '}
        <strong>{defaultValues.password}</strong>
      </Alert> */}

      {!!errorMsg.message && (
        <CustomErrorComponent
          errorMsg={errorMsg}
          handleResendCode={handleResendCode}
          actionName="Send"
        />
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </Box>
  );
}
