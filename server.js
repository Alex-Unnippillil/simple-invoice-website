const express = require('express');
const docusign = require('docusign-esign');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));
const port = process.env.PORT || 3000;

// Simple in-memory storage for envelope status
const envelopeStatus = {};

// Docusign API client setup
const apiClient = new docusign.ApiClient();
apiClient.setBasePath(process.env.DS_BASE_PATH || 'https://demo.docusign.net/restapi');
apiClient.setOAuthBasePath(process.env.DS_OAUTH_BASE_PATH || 'account-d.docusign.com');
let accessToken;

// OAuth endpoints
app.get('/auth', (req, res) => {
  const authUri = apiClient.getAuthorizationUri(
    process.env.DS_CLIENT_ID,
    process.env.REDIRECT_URI,
    true,
    'code',
    'signature'
  );
  res.redirect(authUri);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const token = await apiClient.generateAccessToken(
      process.env.DS_CLIENT_ID,
      process.env.DS_CLIENT_SECRET,
      code
    );
    accessToken = token.access_token;
    res.send('Authentication successful');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Simple completion page
app.get('/complete', (req, res) => {
  res.send('Signing session complete. You may close this window.');
});

// Create lease envelope and recipient view
app.post('/lease', async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated with DocuSign' });
  }
  const { tenantName, tenantEmail } = req.body;
  const envelopeApi = new docusign.EnvelopesApi(apiClient);
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
  const envDef = new docusign.EnvelopeDefinition();
  envDef.templateId = process.env.DS_TEMPLATE_ID;
  const role = new docusign.TemplateRole();
  role.email = tenantEmail;
  role.name = tenantName;
  role.roleName = 'signer';
  role.clientUserId = '1';
  envDef.templateRoles = [role];
  envDef.status = 'sent';
  try {
    const results = await envelopeApi.createEnvelope(process.env.DS_ACCOUNT_ID, { envelopeDefinition: envDef });
    const envelopeId = results.envelopeId;
    envelopeStatus[envelopeId] = 'sent';
    const viewReq = new docusign.RecipientViewRequest();
    viewReq.returnUrl = process.env.APP_BASE_URL + '/complete';
    viewReq.authenticationMethod = 'none';
    viewReq.userName = tenantName;
    viewReq.email = tenantEmail;
    viewReq.clientUserId = '1';
    const view = await envelopeApi.createRecipientView(process.env.DS_ACCOUNT_ID, envelopeId, { recipientViewRequest: viewReq });
    res.json({ envelopeId, url: view.url });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Webhook to receive envelope status updates
app.post('/webhook', express.text({ type: '*/*' }), (req, res) => {
  const xml = req.body;
  const idMatch = xml.match(/<envelopeId>(.+?)<\/envelopeId>/i);
  const statusMatch = xml.match(/<status>(.+?)<\/status>/i);
  if (idMatch && statusMatch) {
    envelopeStatus[idMatch[1]] = statusMatch[1];
  }
  res.sendStatus(200);
});

// Endpoint to query envelope status
app.get('/status/:id', (req, res) => {
  const status = envelopeStatus[req.params.id] || 'unknown';
  res.json({ envelopeId: req.params.id, status });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

