import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PointsSettingsListView } from 'src/sections/points-settings/view';

// ----------------------------------------------------------------------

const metadata = { title: `Points Settings list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PointsSettingsListView />
    </>
  );
}
