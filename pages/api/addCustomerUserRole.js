import { auth } from "../../config/firebase-admin";

export default async function handler(req, res) {
  const { uid } = req.body;
  try {
    const user = await auth.setCustomUserClaims(uid, { customer: true });
    res.status(200).json(user);
  } catch (error) {
    console.log(error)
    res.json({
      message: error.message,
      success: false,
    });
  }
}
