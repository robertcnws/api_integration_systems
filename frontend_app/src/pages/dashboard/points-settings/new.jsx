import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PointsSettingsCreateView } from 'src/sections/points-settings/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new points settings | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PointsSettingsCreateView />
    </>
  );
}
