#!/usr/bin/env node
const { Client } = require('pg');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');
const fs = require('fs');

function ensureEnv(vars) {
  const missing = vars.filter((v) => !process.env[v]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

async function checkPostgres() {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.end();
    console.log('Postgres connection successful');
  } catch (err) {
    throw new Error(`Postgres connection failed: ${err.message}`);
  }
}

async function checkStripe() {
  try {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, { apiVersion: '2022-11-15' });
    await stripe.balance.retrieve();
    console.log('Stripe connection successful');
  } catch (err) {
    throw new Error(`Stripe connection failed: ${err.message}`);
  }
}

async function checkSMTP() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.verify();
    console.log('SMTP connection successful');
  } catch (err) {
    throw new Error(`SMTP connection failed: ${err.message}`);
  }
}

async function checkStorage() {
  try {
    await fs.promises.access(process.env.STORAGE_PATH, fs.constants.R_OK | fs.constants.W_OK);
    console.log('Storage path accessible');
  } catch (err) {
    throw new Error(`Storage check failed: ${err.message}`);
  }
}

(async () => {
  try {
    ensureEnv([
      'DATABASE_URL',
      'STRIPE_API_KEY',
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
      'STORAGE_PATH',
    ]);
    await checkPostgres();
    await checkStripe();
    await checkSMTP();
    await checkStorage();
    console.log('All preflight checks passed');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
