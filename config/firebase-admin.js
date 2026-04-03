// import * as admin from "firebase-admin";
var admin = require("firebase-admin");
// var serviceAccount = require("../serviceAccount.json");

const getAdminEnv = (name, legacyName) =>
  process.env[name] || process.env[legacyName];

const adminEnv = {
  type: getAdminEnv("FIREBASE_TYPE", "NEXT_PUBLIC_FIREBASE_TYPE"),
  projectId: getAdminEnv(
    "FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  ),
  privateKeyId: getAdminEnv(
    "FIREBASE_PRIVATE_KEY_ID",
    "NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID"
  ),
  privateKey: getAdminEnv(
    "FIREBASE_PRIVATE_KEY",
    "NEXT_PUBLIC_FIREBASE_PRIVATE_KEY"
  ),
  clientEmail: getAdminEnv(
    "FIREBASE_CLIENT_EMAIL",
    "NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL"
  ),
  clientId: getAdminEnv(
    "FIREBASE_CLIENT_ID",
    "NEXT_PUBLIC_FIREBASE_CLIENT_ID"
  ),
  authUri: getAdminEnv("FIREBASE_AUTH_URI", "NEXT_PUBLIC_FIREBASE_AUTH_URI"),
  tokenUri: getAdminEnv(
    "FIREBASE_TOKEN_URI",
    "NEXT_PUBLIC_FIREBASE_TOKEN_URI"
  ),
  authProviderCertUrl: getAdminEnv(
    "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
    "NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_X509_CERT_URL"
  ),
  clientCertUrl: getAdminEnv(
    "FIREBASE_CLIENT_X509_CERT_URL",
    "NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL"
  ),
};

const usingLegacyAdminEnv = [
  "NEXT_PUBLIC_FIREBASE_TYPE",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID",
  "NEXT_PUBLIC_FIREBASE_PRIVATE_KEY",
  "NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL",
  "NEXT_PUBLIC_FIREBASE_CLIENT_ID",
  "NEXT_PUBLIC_FIREBASE_AUTH_URI",
  "NEXT_PUBLIC_FIREBASE_TOKEN_URI",
  "NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
  "NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL",
].some((name) => process.env[name]);

if (!admin.apps.length) {
  try {
    if (usingLegacyAdminEnv) {
      console.warn(
        "Using legacy NEXT_PUBLIC Firebase Admin env vars. Rename them to server-only FIREBASE_* vars."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        type: adminEnv.type,
        project_id: adminEnv.projectId,
        private_key_id: adminEnv.privateKeyId,
        private_key: adminEnv.privateKey?.replace(/\\n/g, "\n"),
        client_email: adminEnv.clientEmail,
        client_id: adminEnv.clientId,
        auth_uri: adminEnv.authUri,
        token_uri: adminEnv.tokenUri,
        auth_provider_x509_cert_url:
          adminEnv.authProviderCertUrl,
        client_x509_cert_url: adminEnv.clientCertUrl,
      }),
    });
  } catch (error) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
