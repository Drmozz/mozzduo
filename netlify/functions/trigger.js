
const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "mozzduo-f4988",
  private_key_id: "b4fb034a61e24cd6896ae1434b80ffb1c78ee91d",
  private_key: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n", // tronquée ici
  client_email: "firebase-adminsdk-fbsvc@mozzduo-f4988.iam.gserviceaccount.com",
  client_id: "100351119301863718836",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mozzduo-f4988.iam.gserviceaccount.com"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async function (event, context) {
  const params = event.queryStringParameters;
  const eventID = params.event || "test1";
  const key = params.key || null;

  if (!key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Missing key parameter" }),
    };
  }

  try {
    const ref = db.doc(`events/${eventID}`);
    await ref.update({
      control: key,
      updatedAt: Date.now() // 👈 force un changement détecté par onSnapshot
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, event: eventID, control: key }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
