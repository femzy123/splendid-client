import { auth } from "../../config/firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
      success: false,
    });
  }

  const { uid } = req.body;
  try {
    await auth.setCustomUserClaims(uid, { customer: true });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
}
