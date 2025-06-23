import * as admin from "firebase-admin";

if (!admin.apps.length) {
 admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // Nếu dùng serviceAccountKey.json thì thay bằng:
  // credential: admin.credential.cert(require("./serviceAccountKey.json")),
 });
}

export { admin };
