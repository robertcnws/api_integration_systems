import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useRewardPointsByUsername } from 'src/_mock';
import { useRewardStoreProductDetailsById } from 'src/_mock/__reward-store-products';

import { StoreProductDetailsView } from 'src/sections/store-product/view';

import { fieldsRewardPoints } from 'src/auth/context/data/field-descriptors/field-descriptors-reward-points';
import { fieldsRewardStoreProductDetails } from 'src/auth/context/data/field-descriptors/field-descriptors-reward-store-products';

// ----------------------------------------------------------------------

const metadata = { title: `Store Product details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const userLogged = JSON.parse(sessionStorage.getItem('userLogged') || '{}');

  const roleName = userLogged?.data?.user_role?.name || 'client';

  const {
    loading: productLoading,
    error: productError,
    data: product,
    refetch: refetchProductDetails
  } = useRewardStoreProductDetailsById(id, fieldsRewardStoreProductDetails);

  const {
    loading: userLoggedRewardPointsLoading,
    error: userLoggedRewardPointsError,
    data: userLoggedRewardPoints,
    refetch: refetchUserLoggedRewardPoints
  } = useRewardPointsByUsername(userLogged?.data?.username, fieldsRewardPoints);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StoreProductDetailsView
        product={product}
        loading={productLoading}
        error={productError}
        refetch={refetchProductDetails}
        userLoggedRewardPoints={userLoggedRewardPoints}
        userLoggedRewardPointsLoading={userLoggedRewardPointsLoading}
        userLoggedRewardPointsError={userLoggedRewardPointsError}
        refetchUserLoggedRewardPoints={refetchUserLoggedRewardPoints}
        roleName={roleName}
      />
    </>
  );
}
