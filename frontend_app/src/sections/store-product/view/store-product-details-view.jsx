import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { endpoints, wsEndpoints, axiosInstanceBackend } from 'src/utils/axios';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { StoreProductDetailsSkeleton } from '../store-product-skeleton';
import { StoreProductDetailsReview } from '../store-product-details-review';
import { StoreProductDetailsSummary } from '../store-product-details-summary';
import { StoreProductDetailsToolbar } from '../store-product-details-toolbar';
import { StoreProductDetailsCarousel } from '../store-product-details-carousel';
import { StoreProductDetailsDescription } from '../store-product-details-description';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 days replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

export function StoreProductDetailsView({
  product,
  error,
  loading,
  refetch,
  userLoggedRewardPoints,
  userLoggedRewardPointsLoading,
  userLoggedRewardPointsError,
  refetchUserLoggedRewardPoints,
  roleName,
}) {
  const tabs = useTabs('reviews');

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
    }
  }, [product]);


  useEffect(() => {
    if (refetch) {
      refetch().then((data) => {
        if (data && data.rewardStoreProductDetailsById) {
          setCurrentProduct(data.rewardStoreProductDetailsById);
        }
      }).catch((err) => {
        console.error('Error fetching product data:', err);
      });
    }
  }, [refetch]);


  useEffect(() => {
    
    let socket;

    if (product && !error && !loading) {
      socket = new WebSocket(wsEndpoints.rewardPoints.storeProduct.byId(product.id));

      socket.onerror = (errorEvent) => {
        console.error('WebSocket error:', errorEvent);
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (
          message.type === 'created' ||
          message.type === 'updated' ||
          message.type === 'deleted'
        ) {
          refetch()
            .then((data) => {
              if (data?.rewardStoreProductDetailsById) {
                setCurrentProduct(data.rewardStoreProductDetailsById);
              }
            })
            .catch((err) => console.error('Error fetching product data:', err));
        }
      };
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [product, error, loading, refetch]);


  const totalReviews = useMemo(
    () => currentProduct?.reviews?.length || 0,
    [currentProduct]
  );


  const totalRatings = useMemo(
    () => (currentProduct?.reviews?.reduce((total, review) => total + review.rating, 0) || 0) / (currentProduct?.reviews?.length || 1),
    [currentProduct]
  );

  // const [publish, setPublish] = useState('');

  // useEffect(() => {
  //   if (product) {
  //     setPublish(product?.isActive);
  //   }
  // }, [product]);

  // const handleChangePublish = useCallback((newValue) => {
  //   setPublish(newValue);
  // }, []);

  const onAddCart = useCallback(async (quantity) => {
    if (currentProduct) {
      try {
        const payload = {
          quantity,
          userReporter: JSON.stringify(userLogged?.data),
        };

        const url = endpoints.rewardPoints.create.storeProductSelectionCart.item(currentProduct?.id);

        const promise = axiosInstanceBackend.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        toast.promise(promise, {
          loading: 'Loading...',
          success: `Store product added to cart successfully!`,
          error: `Store product added to cart error!`,
        });

        await promise;


      } catch (err) {
        console.error('Error adding product to cart:', err);
      }
    }
  }, [currentProduct, userLogged]);
  
  const onAddBuy = useCallback(async (quantity) => {
    if (currentProduct) {
      try {
        const payload = {
          quantity,
          userReporter: JSON.stringify(userLogged?.data),
        };

        const url = endpoints.rewardPoints.create.storeProductSelectionBuy.item(currentProduct?.id);

        const promise = axiosInstanceBackend.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        toast.promise(promise, {
          loading: 'Loading...',
          success: `Store product purchased successfully!`,
          error: `Store product purchase error!`,
        });

        await promise;


      } catch (err) {
        console.error('Error purchasing product:', err);
      }
    }
  }, [currentProduct, userLogged]);

  if (loading) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <StoreProductDetailsSkeleton />
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Product not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.storeProduct.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <StoreProductDetailsToolbar
        backLink={paths.dashboard.storeProduct.list}
        editLink={paths.dashboard.storeProduct.edit(`${product?.id}`)}
        liveLink={paths.dashboard.storeProduct.details(`${product?.id}`)}
        roleName={roleName}
      // publish={publish}
      // onChangePublish={handleChangePublish}
      // publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <StoreProductDetailsCarousel images={currentProduct?.attachments ?? []} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {currentProduct &&
            <StoreProductDetailsSummary
              // disableActions
              product={currentProduct}
              totalRatings={totalRatings}
              totalReviews={totalReviews}
              onAddCart={onAddCart}
              onAddBuy={onAddBuy}              
              userLoggedRewardPoints={userLoggedRewardPoints}
              userLoggedRewardPointsLoading={userLoggedRewardPointsLoading}
              userLoggedRewardPointsError={userLoggedRewardPointsError}
              refetchUserLoggedRewardPoints={refetchUserLoggedRewardPoints}
            />
          }
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ my: 2 }}
      />
      {/* {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box> */}

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            // { value: 'description', label: 'Description' },
            { value: 'reviews', label: `Reviews (${currentProduct?.reviews?.length})` },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <StoreProductDetailsDescription description={currentProduct?.description ?? ''} />
        )}

        {tabs.value === 'reviews' && (
          <StoreProductDetailsReview
            product={currentProduct}
            refetch={refetch}
            ratings={currentProduct?.ratings ?? []}
            reviews={currentProduct?.reviews ?? []}
            totalRatings={totalRatings}
            totalReviews={totalReviews}
          />
        )}
      </Card>
    </DashboardContent>
  );
}
