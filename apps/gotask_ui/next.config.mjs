/* eslint-env node */
// Or if you prefer individual disables:
/* eslint-disable no-undef */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: NEXT_PUBLIC_API_BASE_URL
  }
};

export default withNextIntl(nextConfig);
