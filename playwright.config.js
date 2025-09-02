/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
};
module.exports = config;
