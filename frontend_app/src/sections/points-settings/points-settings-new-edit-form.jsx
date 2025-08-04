import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { stripHtmlUsingDOM } from 'src/utils/helper';
import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function PointsSettingsNewEditForm({ currentPointsSettingsId, onReturnList }) {

  const { loadedPointsSettings, refetchRewardPoints } = useDataContext();

  const currentPointsSettings = useMemo(() => {
    if (currentPointsSettingsId && loadedPointsSettings) {
      return loadedPointsSettings.find((pointsSettings) => pointsSettings.id === currentPointsSettingsId);
    }
    return null;
  }, [currentPointsSettingsId, loadedPointsSettings]);

  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const [listPointsSettings, setListPointsSettings] = useState(null);

  useEffect(() => {
    if (loadedPointsSettings && loadedPointsSettings.length > 0) {
      setListPointsSettings(loadedPointsSettings);
    }
  }, [loadedPointsSettings]);

  const NewPointsSettingsSchema = zod.object({
    amount: zod.number().min(1, { message: 'Amount must be greater than 0' }),
    points: zod.number().min(1, { message: 'Assigned points must be greater than 0' }),
    description: schemaHelper.editor().optional().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      amount: currentPointsSettings?.amount || 0,
      points: currentPointsSettings?.points || 0,
      description: currentPointsSettings?.description || '',
    }),
    [currentPointsSettings]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewPointsSettingsSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentPointsSettings) {
      reset({
        amount: currentPointsSettings.amount || 0,
        points: currentPointsSettings.points || 0,
        description: currentPointsSettings.description || '',
      });
    } else {
      reset({
        amount: 0,
        points: 0,
        description: '',
      });
    }
  }, [currentPointsSettings, reset]);

  const currentPoints = watch('points') || 0;
  const currentAmount = watch('amount') || 0;

  const increment = (attr, value, STEP = 1) => setValue(attr, value + STEP || 1);
  const decrement = (attr, value, STEP = 1) => setValue(attr, Math.max(1, value - (STEP || 1)));


  const onSubmit = handleSubmit(async (data) => {

    const pointsSettingsId = currentPointsSettings ? currentPointsSettings.id : null;
    const url = pointsSettingsId ?
      endpoints.rewardPoints.update.pointsSettings(pointsSettingsId) :
      endpoints.rewardPoints.create.pointsSettings;

    try {
      await axiosInstanceBackend.post(url, {
        amount: data.amount,
        points: data.points,
        description: stripHtmlUsingDOM(data.description),
        userReporter: JSON.stringify(userLogged?.data),
      });
      reset();
      refetchRewardPoints?.();
      toast.success(pointsSettingsId ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.pointsSettings.list);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error ? err.response.data.error : err.response.data.detail);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>

      <Field.Text
        name="amount"
        label="Amount"
        type="number"
        min={1}
        max={1000000}
        step={0.01}
        InputProps={{
          inputProps: {
            min: 1,
            max: 1000000,
            step: 0.01,
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => decrement('amount', currentAmount, 0.01)} width={30} height={30}>
                <Iconify icon="memory:minus-box" fontSize="small" sx={{ width: 30, height: 30 }} />
              </IconButton>
              <IconButton size="small" onClick={() => increment('amount', currentAmount, 0.01)} width={30} height={30}>
                <Iconify icon="memory:plus-box" fontSize="small" sx={{ width: 30, height: 30 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Field.Text
        sx={{
          mt: 2,
        }}
        name="points"
        label="Assigned Points"
        type="number"
        min={1}
        max={1000000}
        step={1}
        InputProps={{
          inputProps: {
            min: 1,
            max: 1000000,
            step: 1,
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => decrement('points', currentPoints)} width={30} height={30}>
                <Iconify icon="memory:minus-box" fontSize="small" sx={{ width: 30, height: 30 }} />
              </IconButton>
              <IconButton size="small" onClick={() => increment('points', currentPoints)} width={30} height={30}>
                <Iconify icon="memory:plus-box" fontSize="small" sx={{ width: 30, height: 30 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ width: 80, color: 'text.secondary', mr: 2, mt: 2 }}>
        Description
      </Box>
      <Field.Editor name="description" placeholder="Description..." />
      <Stack alignItems="flex-end" sx={{ mt: 3, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ mr: 2 }}>
          {!currentPointsSettings ? 'Create user points settings' : 'Update points settings'}
        </LoadingButton>
        <LoadingButton type="button" variant="outlined" onClick={onReturnList} disabled={isSubmitting}>
          Cancel
        </LoadingButton>
      </Stack>
    </Form>
  );
}
