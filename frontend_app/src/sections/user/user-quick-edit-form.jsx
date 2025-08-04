import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  companyName: zod.string().optional(),
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  // country: schemaHelper.objectOrNull({
  //   message: { required_error: 'Country is required!' },
  // }),
  // state: zod.string().min(1, { message: 'State is required!' }),
  // city: zod.string().min(1, { message: 'City is required!' }),
  // address: zod.string().min(1, { message: 'Address is required!' }),
  // zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  // company: zod.string().min(1, { message: 'Company is required!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { loadedUserRoles, refetchUsers } = useDataContext();

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || '',
      companyName: currentUser?.companyName || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      status: currentUser?.isActive ? 'active' : 'inactive',
      role: currentUser?.userRole.id || '',
    }),
    [currentUser]
  );

  // console.log('defaultValues', defaultValues);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { id } = currentUser;
    data = {
      ...data,
      username: currentUser.username,
      userReporter: userLogged?.data
    };

    const promise = axiosInstanceBackend.post(endpoints.user.edit.user(id), data);

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      // console.info('DATA', data);

      if (data.username === userLogged?.data.username) {
        localStorage.removeItem('userLogged');
        sessionStorage.removeItem('userLogged');
        /* eslint-disable object-shorthand */
        localStorage.setItem('userLogged', JSON.stringify({ data: data }));
        sessionStorage.setItem('userLogged', JSON.stringify({ data: data }));
        /* eslint-enable object-shorthand */
      }

      refetchUsers?.();

    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 920 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick User Info Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            USERNAME: <b>{currentUser?.username}</b>
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)'
            }}
            sx={{
              mb: 3,
              '& .MuiTextField-root': { width: '100%' }
            }}
          >
            <Field.Text name="companyName" label="Company Name" />
          </Box>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)'
            }}
          >
            <Field.Select name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  <Label>
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        mr: 1,
                        borderRadius: '50%',
                        bgcolor: status.color,
                      }}
                    />
                    {status.label}
                  </Label>
                </MenuItem>
              ))}
            </Field.Select>

            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }} /> */}
            <Field.Text name="email" label="Email address" />

            <Field.Text name="firstName" label="First name" />
            <Field.Text name="lastName" label="Last name" />

            <Field.Phone name="phoneNumber" label="Phone number" />

            {/* <Field.CountrySelect
              fullWidth
              name="country"
              label="Country"
              placeholder="Choose a country"
            />

            <Field.Text name="state" label="State/region" />
            <Field.Text name="city" label="City" />
            <Field.Text name="address" label="Address" />
            <Field.Text name="zipCode" label="Zip/code" />
            <Field.Select name="gender" label="Gender">
                <MenuItem key="M" value="M">
                  Male
                </MenuItem>
                <MenuItem key="F" value="F">
                  Female
                </MenuItem>
            </Field.Select> */}
            <Field.Select name="role" label="Role">
              {loadedUserRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </DialogContent>

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
