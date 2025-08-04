import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VerificationCodeView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Verify Code | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VerificationCodeView />
    </>
  );
}
