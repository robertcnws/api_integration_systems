import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { _mock } from 'src/_mock/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {

  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { loadedUsers, refetchUsers, loadedUserRoles } = useDataContext();

  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (loadedUsers && loadedUsers.length > 0) {
      setUsers(loadedUsers);
    }
  }, [loadedUsers]);

  const NewUserSchema = zod.object({
    companyName: zod.string().optional(),
    username: zod.string().min(1, { message: 'Username is required!' }),
    firstName: zod.string().min(1, { message: 'First name is required!' }),
    lastName: zod.string().min(1, { message: 'Last name is required!' }),
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email must be a valid email address!' }),
    phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    role: zod.string().min(1, { message: 'Role is required!' }),
    password: currentUser ? zod.string() : zod.string().min(1, { message: 'Password is required!' }),
    confirmPassword: currentUser ? zod.string() : zod.string().min(1, { message: 'Confirm Password is required!' }),
  })
    .refine((data) => {
      if (!currentUser) {
        return data.password === data.confirmPassword;
      }
      return true;
    }, {
      message: "Passwords must match",
      path: ["confirmPassword"],
    })
    .refine((data) => {
      if (!currentUser) {
        const usernameExists = users?.some(
          (user) => user.username.toLowerCase() === data.username.toLowerCase()
        );
        return !usernameExists;
      }
      return true;
    }, {
      message: "Username already exists",
      path: ["username"],
    });

  const defaultValues = useMemo(
    () => ({
      companyName: currentUser?.companyName || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      role: currentUser?.userRole || '',
      isActive: currentUser?.isActive || true,
      password: '',
      confirmPassword: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = handleSubmit(async (data) => {

    const roleName = loadedUserRoles?.find((role) => role.id === data.role)?.name;
    const { username } = data;

    try {
      const randomNumber = Math.floor(Math.random() * 25) + 1;
      await axiosInstanceBackend.post(endpoints.user.create.user, {
        ...data,
        userReporter: userLogged?.data,
        avatarUrl: _mock.image.avatar(randomNumber),
      });
      await refetchUsers?.();
      reset();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>

        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
              sx={{
                mb: 3,
                '& .MuiTextField-root': { width: '100%' },
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
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="username" label="Username" />
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
                {loadedUserRoles?.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="password" label="Password" type="password" />
              <Field.Text name="confirmPassword" label="Confirm Password" type="password" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3, flexDirection: 'row', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </LoadingButton>
              <Button type="button" variant="outlined" onClick={() => router.push(paths.dashboard.user.list)}>
                Cancel
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
