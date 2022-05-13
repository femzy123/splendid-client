import { auth } from "../../config/firebase-admin";

export default async function handler(req, res) {
  try {
    const { uid } = req.body;
    const user = await auth.setCustomUserClaims(uid, { customer: true });
    res.status(200).json(user);
  } catch (error) {
    res.json({
      message: error.message,
      success: false,
    });
  }
}
