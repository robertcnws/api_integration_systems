import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StoreProductNewEditForm } from '../store-product-new-edit-form';


// ----------------------------------------------------------------------

export function StoreProductCreateView() {

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new store product"
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Store Product', href: paths.dashboard.storeProduct.list },
          { name: 'New store product' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StoreProductNewEditForm />
    </DashboardContent>
  );
}
