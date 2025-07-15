/* eslint-env node */
// Or if you prefer individual disables:
/* eslint-disable no-undef */

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const nextConfig = {  
  output: 'standalone'
};

export default withNextIntl(nextConfig);