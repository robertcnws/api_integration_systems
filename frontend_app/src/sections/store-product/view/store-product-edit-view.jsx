import { Box, Typography, LinearProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { useRewardStoreProductById } from 'src/_mock/__reward-store-products';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { fieldsRewardStoreProducts } from 'src/auth/context/data/field-descriptors/field-descriptors-reward-store-products';

import { StoreProductNewEditForm } from '../store-product-new-edit-form';



// ----------------------------------------------------------------------

export function StoreProductEditView() {

  const {
    id: storeProductId,
  } = useParams();

  const {
    data: currentStoreProduct,
    loading: loadingStoreProduct,
    error: errorStoreProduct,
    refetch: refetchStoreProduct,
  } = useRewardStoreProductById(storeProductId, fieldsRewardStoreProducts);

  // useEffect(() => {
  //   const socket = new WebSocket(
  //     wsEndpoints.rewardPoints.storeProduct.byId(storeProductId)
  //   );
  //   socket.onmessage = (e) => {
  //     const msg = JSON.parse(e.data);
  //     if (['created', 'updated', 'deleted'].includes(msg.type)) {
  //       refetchStoreProduct?.().catch(console.error);
  //     }
  //   };
  //   socket.onerror = console.error;
  //   return () => {
  //     if (socket.readyState === WebSocket.OPEN) socket.close();
  //   };
  // }, [refetchStoreProduct, storeProductId]);

  if (loadingStoreProduct) {
    return <DashboardContent>
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
          Loading store product...
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
    </DashboardContent>;
  }

  if (errorStoreProduct) {
    return <DashboardContent>
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
          Error loading store product
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
    </DashboardContent>;
  }

  if (!currentStoreProduct) {
    return <DashboardContent>
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
          Store product not found
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
    </DashboardContent>;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit store product"
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Store Product', href: paths.dashboard.storeProduct.list },
          { name: 'Edit store product' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StoreProductNewEditForm
        currentStoreProduct={currentStoreProduct} refetchStoreProduct={refetchStoreProduct}
      />

    </DashboardContent>
  );
}
