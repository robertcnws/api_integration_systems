import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

export function UserQuickChangePasswordForm({ currentUser, open, onClose, isSameUser = false }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { loadedUserRoles, refetchUsers } = useDataContext();

  const UserQuickChangePasswordSchema = isSameUser ? zod.object({
    password: zod.string().min(6, { message: 'Password must be at least 6 characters!' }),
    newPassword: zod.string().min(6, { message: 'New password must be at least 6 characters!' }),
    confirmPassword: zod.string().min(6, { message: 'Confirm password must be at least 6 characters!' }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  }) : zod.object({
    newPassword: zod.string().min(6, { message: 'New password must be at least 6 characters!' }),
    confirmPassword: zod.string().min(6, { message: 'Confirm password must be at least 6 characters!' }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || '',
      password: '',
      newPassword: '',
      confirmPassword: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickChangePasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { id } = currentUser;
    
    const payload = {
      ...data,
      isSameUser: isSameUser ? 'same' : 'different',
    };

    try {
      const promise = axiosInstanceBackend.post(endpoints.user.changePassword.user(id), payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      const response = await promise;

      if (response.data && response.data.error) {
        setError('password', { type: 'server', message: response.data.error });
        return;
      }

      reset();
      onClose();

      if (payload.username === userLogged?.data.username) {
        localStorage.removeItem('userLogged');
        sessionStorage.removeItem('userLogged');
        localStorage.setItem('userLogged', JSON.stringify({ data: payload }));
        sessionStorage.setItem('userLogged', JSON.stringify({ data: payload }));
      }

      refetchUsers?.();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Update failed';
      setError('password', { type: 'server', message: errorMsg });
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick User Change Password</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            USERNAME: <b>{currentUser?.username}</b>
          </Alert>

          <Box
            rowGap={3}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
          >
            {isSameUser && (
              <Field.Text name="password" label="Current Password" type="password" />
            )}
            <Field.Text name="newPassword" label="New Password" type="password" />
            <Field.Text name="confirmPassword" label="Confirm Password" type="password" />
          </Box>
        </DialogContent>

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Change Password
          </LoadingButton>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
