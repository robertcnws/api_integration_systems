import { z as zod } from 'zod';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField, Typography, LinearProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { LoadingContext } from 'src/auth/context/loading-context';

import { signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { CustomErrorComponent } from './custom-error-component';



// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  username: zod
    .string()
    .min(1, { message: 'Username is required!' })
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
      message: 'Username must start with a letter and contain only letters, numbers, or underscores',
    })
    .min(6, { message: 'Username must be at least 6 characters' }),

  companyName: zod.string().min(1, { message: 'Company name is required!' }),
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
  phoneNumber: zod.string().min(1, { message: 'Phone number is required!' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();

  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState({
    message: '',
    name: '',
    email: '',
  });

  const [currentUsername, setCurrentUsername] = useState('');

  const isSending = useBoolean(false);

  const [titleIsSending, setTitleIsSending] = useState('');

  const { isMobile } = useContext(LoadingContext);


  const defaultValues = {
    username: '',
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setTitleIsSending('Signing up...');
    isSending.onTrue();
    setCurrentUsername(data.username);
    sessionStorage.setItem('userSignedUp', JSON.stringify({
      data: {
        username: data.username,
        companyName: data.companyName,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      },
    }));
    try {
      await signUp({
        username: data.username,
        companyName: data.companyName,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });
      await checkUserSession();
      sessionStorage.setItem('userSignedUpEmail', data.email);
      sessionStorage.setItem('isNewUserSignedUp', 'true');
      router.push(paths.auth.jwt.verificationCode);
    } catch (error) {
      console.error(error);
      setErrorMsg({
        message: typeof error === 'string' ? error : error.description,
        name: error.error_name || '',
        email: error.error_email || '',
      });
      sessionStorage.setItem('userSignedUpEmail', error.error_email || data.email);
      sessionStorage.setItem('isNewUserSignedUp', error.error_email ? 'false' : 'true');
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
        username: currentUsername,
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

        <Controller
          name="username"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Username"
              error={!!error}
              helperText={error?.message || ''}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                field.onChange(e);
                if (errorMsg.message.length > 0) {
                  setErrorMsg({
                    name: '',
                    message: '',
                    email: '',
                  });
                }
              }}
            />
          )}
        />

        <Field.Text name="companyName" label="Company name" InputLabelProps={{ shrink: true }} />

        <Box display="flex" gap={{ xs: 3, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Field.Text name="firstName" label="First name" InputLabelProps={{ shrink: true }} />
          <Field.Text name="lastName" label="Last name" InputLabelProps={{ shrink: true }} />
        </Box>

        <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

        <Field.Phone name="phoneNumber" label="Phone or Mobile" InputLabelProps={{ shrink: true }} />

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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
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
          mt: !isMobile ? 0 : 30,
          width: { xs: '100%', sm: '550px' },
          // maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 1,
          position: 'relative',
        }}>
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              py: 1,
              px: 1,
              mb: 1
            }}
          >
            <FormHead
              title="Get started absolutely free"
              description={
                <>
                  {`Already have an account? `}
                  <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
                    Sign in
                  </Link>
                </>
              }
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
            />

            {!!errorMsg.message && (
              <CustomErrorComponent
                errorMsg={errorMsg}
                handleResendCode={handleResendCode}
                actionName="Send"
              />
            )}
          </Box>


          <Form methods={methods} onSubmit={onSubmit}>
            {renderForm}
          </Form>

          {/* <SignUpTerms /> */}
        </Box>
      )}
    </>
  );
}
