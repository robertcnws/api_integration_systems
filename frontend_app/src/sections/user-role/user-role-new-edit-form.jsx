import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { stripHtmlUsingDOM } from 'src/utils/helper';
import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function UserRoleNewEditForm({ currentUserRoleId, onReturnList }) {

  const { loadedAllRewardUserRoles } = useDataContext();

  const currentUserRole = useMemo(() => {
    if (currentUserRoleId && loadedAllRewardUserRoles) {
      return loadedAllRewardUserRoles.find((role) => role.id === currentUserRoleId);
    }
    return null;
  }, [currentUserRoleId, loadedAllRewardUserRoles]);

  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const [userRoles, setUserRoles] = useState(null);

  useEffect(() => {
    if (loadedAllRewardUserRoles && loadedAllRewardUserRoles.length > 0) {
      setUserRoles(loadedAllRewardUserRoles);
    }
  }, [loadedAllRewardUserRoles]);

  const NewUserRoleSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: schemaHelper.editor().optional().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUserRole?.name || '',
      description: currentUserRole?.description || '',
    }),
    [currentUserRole]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserRoleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = handleSubmit(async (data) => {

    const roleId = currentUserRole ? currentUserRole.id : null;
    const url = roleId ? 
    endpoints.user.edit.userRole(roleId) : 
    endpoints.user.role.create;

    try {
      await axiosInstanceBackend.post(url, {
        name: data.name,
        description: stripHtmlUsingDOM(data.description),
        userReporter: userLogged?.data,
      });
      reset();
      toast.success(roleId ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.role.list);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error ? err.response.data.error : err.response.data.detail);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>

      <Field.Text name="name" label="Name" placeholder="Name" />
      <Box sx={{ width: 80, color: 'text.secondary', mr: 2, mt: 2 }}>
        Description
      </Box>
      <Field.Editor name="description" placeholder="Description..." />
      <Stack alignItems="flex-end" sx={{ mt: 3, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ mr: 2 }}>
          {!currentUserRole ? 'Create user role' : 'Update user role'}
        </LoadingButton>
        <LoadingButton type="button" variant="outlined" onClick={onReturnList} disabled={isSubmitting}>
          Cancel
        </LoadingButton>
      </Stack>
    </Form>
  );
}
