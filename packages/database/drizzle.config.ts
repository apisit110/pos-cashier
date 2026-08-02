import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '../model/src/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: '../../pos-cashier.db',
  },
});
