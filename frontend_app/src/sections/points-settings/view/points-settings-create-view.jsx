import { useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PointsSettingsNewEditForm } from '../points-settings-new-edit-form';



// ----------------------------------------------------------------------

export function PointsSettingsCreateView() {

  const currentPointsSettingsId = localStorage.getItem('currentPointsSettingsId');

  const router = useRouter();

  const handleReturnList = useCallback(
    () => {
      router.push(paths.dashboard.pointsSettings.list);
    },
    [router]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={!currentPointsSettingsId ? "Create a points settings" : "Edit points settings"}
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Points Settings', href: paths.dashboard.pointsSettings.list },
          { name: !currentPointsSettingsId ? "Create points settings" : "Edit points settings" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PointsSettingsNewEditForm currentPointsSettingsId={currentPointsSettingsId} onReturnList={handleReturnList}/>
    </DashboardContent>
  );
}
