
const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "mozzduo-f4988",
  private_key_id: "b4fb034a61e24cd6896ae1434b80ffb1c78ee91d",
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDFvKObloXR4Y40
VW0ZfkhbGdpZlLhlvyVtKrQywyTVJ34TUAwDjY3QTcReEBe51OkubEdqCzS+0Hb6
C4fzHI6LewY1gxSqe3nfwFpJyQN6NhJbXsUAXBD6vFxxOO5U1ltveWjwM1yDRN1a
GaSJ9NbP4ebA3MBy2lHnC8V2cVRrjYVeQEnxPPKuSu518mdp6Zj2BSYDUHBwaFTy
UMhs2SuT7MWmbOlJn1JPrTjEaxeJz5pbevudf85vbGWhtyev1YzZF8ukY//07KKe
UBEQRoD6QDkwCCm40KmZnv8x+baqjkgAuqlB2EM12IJb1eVZgIYCX6RWWKUD9FDr
j6jjwh8XAgMBAAECggEAISRnhbX6cv2rsJDa6ul0JjTUmKwpJgCePMhqEJINs95d
Ls59XQEWUmIediebWm3ZsYq7g4YiTpMxReK15CUWrUEu/rwcNCDjAgJC/9f9ybeT
ZxYgzdkgjW4RznZc2AJfq/T9BjmNmYDq2uWuYuMTOB+kZhH5/aYjESczbxE6tZXk
28vNL3HgYAnRXS33R9IGF6ndwQO6tt4QJRutAuG3ATn/if4A25w9UQbKaGTglgvE
iPw3zAME4c8qtyerVM6n2DFEPRAZFbW7uDFXC6w25t4C7yw7XJHz/OnkJobJKMpE
nlR/g7LxOT0pTbkUcL3J9kI6am8w8Xx7Ifr7ZEukoQKBgQDo54CBiagnFwCvY3mO
HydqekPAafj+s7e2Tws6aul8AXIIN0TnhTx1LyQ5+F9BfwLm/qm1+NfREcBYuTIP
Or2vIjt8UKPFasr1RQJFpIOncNW42AKj+DQZiFAmNNv6piYAVYfwKWTzr8gO7yo8
vb//NL4yGEWsA123t75x64xF4QKBgQDZWGDWHTwrHF85QeodYlwm3qpNj+Q9UhJ3
wpY/WZVPOnRKMDryODxjU3SOzzuCEvLEtSm4xHAJF7UmkmWZL62K482DL56Sbemp
8q0qxn7LtvUFyYcH3D6g2ckJhkVZfbzhnINOPx2JS0FeRwLvJZlhUKxlU9DSmix5
SU1jx5sT9wKBgGfl/lnLQwxNIq0bPzq7gyXo7RiFLeLR4X6evG+PCiGbs3ce0MpH
kbTlFtAVkMjzFCRgLu1S2VQXCyuJUl+g4MWkC81lW+nRvkC0TFMtFN45Y95V3rev
He7V9ItWwVuLiyBTB5WHodVj8WdYIgt+yovax44pbctSpRg0C+1eGvGBAoGAacaY
QjwyJy0EruIEZU6UWJpvOZY41xsVP9Gku6oGf2uMYvq8BVwXD6PzCvmSFYjRO6iL
aI+5ksNF90KyTW4lwH2DbEAFpW/2ky421qWJ2eztrGZa4BlxJWk4bPk60QXfodFB
GhifcEz+wDpBFFAxKGpRrHKxI33C/TgOgOwI7hsCgYBc3DfTcVrsuOHUhkmyoncu
fonh7qoCjx/r8jOKrMjrSc52rvLy88yVMMK6BefTI88VBnlKz8BptNNKb1easzQp
HdFAM7mKYHozyTnpbrDkazBFqw9/AjTA33z0apqPnQAkg3u2ae5X5Iq9Tgy1R1vg
aQ1iKfZwQlF/Ie072FbZ9g==
-----END PRIVATE KEY-----
`,
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
    const snap = await ref.get();
    const data = snap.data();
    const current = typeof data.control === "number" ? data.control : -1;

    await ref.update({
      trigger: key,
      control: current + 1
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, event: eventID, trigger: key, newControl: current + 1 }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
