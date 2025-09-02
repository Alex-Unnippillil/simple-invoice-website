import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tenant schema stores SMS opt-in details and registration notes
export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  phoneNumber: text('phone_number'),
  smsOptIn: integer('sms_opt_in', { mode: 'boolean' }).default(false),
  registrationNotes: text('registration_notes'),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
