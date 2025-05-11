// netlify/functions/trigger.js

const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "mozzduo-f4988",
  private_key_id: "b4fb034a61e24cd6896ae1434b80ffb1c78ee91d",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDFvKObloXR4Y40\nVW0ZfkhbGdpZlLhlvyVtKrQywyTVJ34TUAwDjY3QTcReEBe51OkubEdqCzS+0Hb6\nC4fzHI6LewY1gxSqe3nfwFpJyQN6NhJbXsUAXBD6vFxxOO5U1ltveWjwM1yDRN1a\nGaSJ9NbP4ebA3MBy2lHnC8V2cVRrjYVeQEnxPPKuSu518mdp6Zj2BSYDUHBwaFTy\nUMhs2SuT7MWmbOlJn1JPrTjEaxeJz5pbevudf85vbGWhtyev1YzZF8ukY//07KKe\nUBEQRoD6QDkwCCm40KmZnv8x+baqjkgAuqlB2EM12IJb1eVZgIYCX6RWWKUD9FDr\nj6jjwh8XAgMBAAECggEAISRnhbX6cv2rsJDa6ul0JjTUmKwpJgCePMhqEJINs95d\nLs59XQEWUmIediebWm3ZsYq7g4YiTpMxReK15CUWrUEu/rwcNCDjAgJC/9f9ybeT\nZxYgzdkgjW4RznZc2AJfq/T9BjmNmYDq2uWuYuMTOB+kZhH5/aYjESczbxE6tZXk\n28vNL3HgYAnRXS33R9IGF6ndwQO6tt4QJRutAuG3ATn/if4A25w9UQbKaGTglgvE\niPw3zAME4c8qtyerVM6n2DFEPRAZFbW7uDFXC6w25t4C7yw7XJHz/OnkJobJKMpE\nnlR/g7LxOT0pTbkUcL3J9kI6am8w8Xx7Ifr7ZEukoQKBgQDo54CBiagnFwCvY3mO\nHydqekPAafj+s7e2Tws6aul8AXIIN0TnhTx1LyQ5+F9BfwLm/qm1+NfREcBYuTIP\nOr2vIjt8UKPFasr1RQJFpIOncNW42AKj+DQZiFAmNNv6piYAVYfwKWTzr8gO7yo8\nvb//NL4yGEWsA123t75x64xF4QKBgQDZWGDWHTwrHF85QeodYlwm3qpNj+Q9UhJ3\nwpY/WZVPOnRKMDryODxjU3SOzzuCEvLEtSm4xHAJF7UmkmWZL62K482DL56Sbemp\n8q0qxn7LtvUFyYcH3D6g2ckJhkVZfbzhnINOPx2JS0FeRwLvJZlhUKxlU9DSmix5\nSU1jx5sT9wKBgGfl/lnLQwxNIq0bPzq7gyXo7RiFLeLR4X6evG+PCiGbs3ce0MpH\nkbTlFtAVkMjzFCRgLu1S2VQXCyuJUl+g4MWkC81lW+nRvkC0TFMtFN45Y95V3rev\nHe7V9ItWwVuLiyBTB5WHodVj8WdYIgt+yovax44pbctSpRg0C+1eGvGBAoGAacaY\nQjwyJy0EruIEZU6UWJpvOZY41xsVP9Gku6oGf2uMYvq8BVwXD6PzCvmSFYjRO6iL\naI+5ksNF90KyTW4lwH2DbEAFpW/2ky421qWJ2eztrGZa4BlxJWk4bPk60QXfodFB\nGhifcEz+wDpBFFAxKGpRrHKxI33C/TgOgOwI7hsCgYBc3DfTcVrsuOHUhkmyoncu\nfonh7qoCjx/r8jOKrMjrSc52rvLy88yVMMK6BefTI88VBnlKz8BptNNKb1easzQp\nHdFAM7mKYHozyTnpbrDkazBFqw9/AjTA33z0apqPnQAkg3u2ae5X5Iq9Tgy1R1vg\naQ1iKfZwQlF/Ie072FbZ9g==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@mozzduo-f4988.iam.gserviceaccount.com",
  client_id: "100351119301863718836",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mozzduo-f4988.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
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
    await ref.update({ control: key });

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
