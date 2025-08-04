import { useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserRoleNewEditForm } from '../user-role-new-edit-form';



// ----------------------------------------------------------------------

export function UserRoleCreateView() {

  const currentUserRoleId = localStorage.getItem('currentUserRoleId');

  const router = useRouter();

  const handleReturnList = useCallback(
    () => {
      router.push(paths.dashboard.role.list);
    },
    [router]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={!currentUserRoleId ? "Create a new role" : "Edit role"}
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'User Role', href: paths.dashboard.role.list },
          { name: !currentUserRoleId ? "Create role" : "Edit role" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserRoleNewEditForm currentUserRoleId={currentUserRoleId} onReturnList={handleReturnList}/>
    </DashboardContent>
  );
}
