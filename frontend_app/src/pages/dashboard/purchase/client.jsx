import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useRewardPointsByUsername } from 'src/_mock';
import { useRewardPointsHistoryByRewardPointsId } from 'src/_mock/__reward-points-history';

import { PurchaseOverviewClientView } from 'src/sections/purchase/view';

import { useDataContext } from 'src/auth/context/data/data-context';
import { fieldsRewardPoints, fieldsRewardPointsHistory } from 'src/auth/context/data/field-descriptors/field-descriptors-reward-points';

// ----------------------------------------------------------------------

const metadata = { title: `Client View | Dashboard - ${CONFIG.appName}` };

const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

const roleName = userLogged?.data?.user_role?.name || '';

export default function Page() {

  const {
    loadedAllUsers,
    refetchUsers,
  } = useDataContext();

  const { id } = useParams();

  console.log('clientId', id);

  const client = useMemo(() => {
    refetchUsers()?.catch(() => { });
    return loadedAllUsers?.find((user) => user.id === id) || null;
  }, [id, loadedAllUsers, refetchUsers]);

  const fields = useMemo(() => fieldsRewardPoints, []);

  const fieldsHistory = useMemo(() => fieldsRewardPointsHistory, []);

  const byUsernameQuery = useRewardPointsByUsername(
    client?.username,
    fields
  );

  const historyQuery = useRewardPointsHistoryByRewardPointsId(
    byUsernameQuery?.data?.id,
    fieldsHistory
  );

  console.log('historyQuery', historyQuery);

  const loadedRewardPoints = byUsernameQuery?.data;

  const refetchRewardPoints = byUsernameQuery?.refetch;

  const loadingRewardPoints = byUsernameQuery?.loading;

  const errorRewardPoints = byUsernameQuery?.error;

  const loadedRewardPointsHistory = historyQuery?.data;

  const refetchRewardPointsHistory = historyQuery?.refetch;

  const loadingRewardPointsHistory = historyQuery?.loading;

  const errorRewardPointsHistory = historyQuery?.error;

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PurchaseOverviewClientView
        client={client}
        loadedRewardPoints={loadedRewardPoints}
        refetchRewardPoints={refetchRewardPoints}
        loadingRewardPoints={loadingRewardPoints}
        errorRewardPoints={errorRewardPoints}
        loadedRewardPointsHistory={loadedRewardPointsHistory}
        refetchRewardPointsHistory={refetchRewardPointsHistory}
        loadingRewardPointsHistory={loadingRewardPointsHistory}
        errorRewardPointsHistory={errorRewardPointsHistory}
      />

      {/* {roleName !== 'office staff' ? (
        <PurchaseListView />
      ) : (
        <PurchaseOfficeListView />
      )} */}
    </>
  );
}
