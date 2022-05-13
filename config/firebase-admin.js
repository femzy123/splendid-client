// import * as admin from "firebase-admin";
var admin = require('firebase-admin');
// var serviceAccount = require("../serviceAccount.json");

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: process.env.NEXT_PUBLIC_FIREBASE_TYPE,
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
        client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
        client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
        auth_uri: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
        token_uri: process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url:
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url:
          process.env.NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL,
      }),
    });
  } catch (error) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
