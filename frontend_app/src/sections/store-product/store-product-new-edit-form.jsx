import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Typography, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints, axiosInstanceBackend } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export function StoreProductNewEditForm({ currentStoreProduct, refetchStoreProduct }) {
  const router = useRouter();
  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const [initialFiles, setInitialFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [fileToRemove, setFileToRemove] = useState(null);
  const confirm = useBoolean();
  const confirmAll = useBoolean();

  const NewSchema = zod.object({
    name: zod.string().min(1, 'Name is required!'),
    description: zod.string().optional(),
    assignedPoints: zod.number().min(1, 'Assigned points must be greater than 0'),
    status: zod.boolean().optional(),
    attachments: schemaHelper.files({ requireFiles: false }),
  });

  // Load initial attachments only when product ID changes
  useEffect(() => {
    const attachments = currentStoreProduct?.attachments || [];
    if (!attachments.length) {
      setInitialFiles([]);
      return;
    }
    async function loadFiles() {
      const loaded = await Promise.all(
        attachments.map(async (att) => {
          if (att instanceof File) {
            return {
              ...att,
              fileUrl: URL.createObjectURL(att),
              uid: `${Date.now()}-${Math.random()}`,
              name: att.name,
              isNew: true,
            };
          }
          if (!att.file) return att;
          try {
            const resp = await axiosInstanceBackend.get(endpoints.rewardPoints.getFileUrl(att.file));
            const { url } = await resp.data;
            return {
              ...att,
              fileUrl: url,
              isNew: false,
              uid: att.file
            };
          } catch {
            console.error('Error fetching URL for attachment', att);
            return att;
          }
        })
      );
      setInitialFiles(loaded);
    }
    loadFiles();
  }, [currentStoreProduct?.attachments]);

  const displayFiles = useMemo(() => [...initialFiles, ...newFiles], [initialFiles, newFiles]);

  const defaultValues = useMemo(
    () => ({
      name: currentStoreProduct?.name || '',
      description: currentStoreProduct?.description || '',
      assignedPoints: currentStoreProduct?.assignedPoints || 1,
      attachments: displayFiles,
      status: currentStoreProduct?.isActive || false,
    }),
    [currentStoreProduct, displayFiles]
  );

  const methods = useForm({ mode: 'onSubmit', resolver: zodResolver(NewSchema), defaultValues });
  const { reset, handleSubmit, setValue, watch, formState: { isSubmitting } } = methods;

  // Sync form when attachments change
  useEffect(() => {
    setValue('attachments', displayFiles, { shouldValidate: true });
  }, [displayFiles, setValue]);

  const currentPoints = watch('assignedPoints') || 0;
  const increment = () => setValue('assignedPoints', currentPoints + 1);
  const decrement = () => setValue('assignedPoints', Math.max(1, currentPoints - 1));
  const currentAttachments = () => Array.isArray(watch('attachments')) ? watch('attachments') : [];

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('assignedPoints', data.assignedPoints.toString());
    formData.append('status', data.status);
    formData.append('userReporter', JSON.stringify(userLogged.data));
    currentAttachments().forEach((file) => {
      if (file instanceof File) formData.append('attachments', file);
    });

    const url = currentStoreProduct
      ? endpoints.rewardPoints.update.storeProduct.item(currentStoreProduct.id)
      : endpoints.rewardPoints.create.storeProduct;
    const action = currentStoreProduct ? 'update' : 'create';

    try {
      const promise = axiosInstanceBackend.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.promise(promise, {
        loading: 'Loading...',
        success: `Store product ${action}d successfully!`,
        error: `Store product ${action} error!`,
      });
      await promise;
      refetchStoreProduct?.();
      router.push(paths.dashboard.storeProduct.list);
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handleSwitch = (e) => setValue('status', e.target.checked);
  const handleClickRemoveFile = (file) => {
    setFileToRemove(file);
    confirm.onTrue();
  };
  const handleClickRemoveAll = () => confirmAll.onTrue();

  const handleConfirmRemove = useCallback(async () => {
    if (!fileToRemove) return;
    // console.log('Removing file:', fileToRemove);
    if (fileToRemove instanceof File) {
      setNewFiles((prev) => {
        const updated = prev.filter((f) => f.name !== fileToRemove.name);
        toast.success('Local file removed');
        setValue('attachments', [...initialFiles, ...updated], { shouldValidate: true });
        return updated;
      });
    } else {
      try {
        await axiosInstanceBackend.delete(
          endpoints.rewardPoints.delete.file.storeProduct.item(currentStoreProduct.id, fileToRemove.file),
          { data: { userReporter: userLogged.data } }
        );
        setInitialFiles((prev) => {
          const updated = prev.filter((f) => f.id !== fileToRemove.id);
          toast.success('File deleted successfully');
          setValue('attachments', [...updated, ...newFiles], { shouldValidate: true });
          return updated;
        });
      } catch {
        toast.error('Error deleting file');
      }
    }
    confirm.onFalse();
    setFileToRemove(null);
  }, [fileToRemove, initialFiles, newFiles, setValue, currentStoreProduct, userLogged, confirm]);


  const handleConfirmRemoveAll = useCallback(async () => {
    if (initialFiles.length) {
      try {
        await axiosInstanceBackend.delete(
          endpoints.rewardPoints.delete.file.storeProduct.all(currentStoreProduct.id),
          { data: { userReporter: userLogged.data } }
        );
        toast.success('All files deleted successfully');
      } catch {
        toast.error('Error deleting files');
      }
    }
    setInitialFiles([]);
    setNewFiles([]);
    setValue('attachments', [], { shouldValidate: true });
    confirmAll.onFalse();
    setFileToRemove(null);
    refetchStoreProduct?.();
  }, [initialFiles.length, setValue, currentStoreProduct, userLogged, confirmAll, refetchStoreProduct]);

  const handleUploadFiles = (files) => {
    const list = Array.isArray(files) ? files : [files];
    const wrapped = list.map((file) => ({
      ...file,
      uid: `${Date.now()}-${Math.random()}`,
      isNew: true,
    }));
    console.log('Uploading files:', wrapped);
    setNewFiles((prev) => [...prev, ...wrapped]);
  };

  const handleDownloadFile = (file) => {
    if (!file?.fileUrl) return;
    const a = document.createElement('a');
    a.href = file.fileUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr' }} sx={{ mb: 3 }}>
                <Field.Text name="name" label="Name" />
                <Field.Text
                  name="assignedPoints"
                  label="Assigned Points"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1, max: 1000000, step: 1 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={decrement}>
                          <Iconify icon="memory:minus-box" />
                        </IconButton>
                        <IconButton size="small" onClick={increment}>
                          <Iconify icon="memory:plus-box" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Field.Text name="description" label="Description" multiline rows={3} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary"><b>Is Active?</b></Typography>
                  <Field.Switch name="status" checked={watch('status')} onChange={handleSwitch} />
                </Box>
                <Field.Upload
                  multiple
                  thumbnail
                  name="attachments"
                  label="Attachments"
                  maxSize={3145728}
                  onRemove={handleClickRemoveFile}
                  onRemoveAll={handleClickRemoveAll}
                  onUpload={handleUploadFiles}
                  onDownload={handleDownloadFile}
                />
              </Box>
              <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {currentStoreProduct ? 'Save changes' : 'Create store product'}
                </LoadingButton>
                <Button variant="outlined" onClick={() => router.push(paths.dashboard.storeProduct.list)}>
                  Cancel
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>

      <ConfirmDialog
        open={confirm.value}
        onClose={() => { confirm.onFalse(); setFileToRemove(null); }}
        title="Remove File"
        content={fileToRemove && (
          <>Are you sure you want to delete the file <strong>{fileToRemove.name}</strong> from <strong>store product <em>{currentStoreProduct?.name}</em></strong>?</>
        )}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmRemove}>
            Remove
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmAll.value}
        onClose={confirmAll.onFalse}
        title="Remove All Files"
        content={<>Are you sure you want to delete all files from <strong>store product <em>{currentStoreProduct?.name}</em></strong>?</>}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmRemoveAll}>
            Remove
          </Button>
        }
      />
    </>
  );
}
