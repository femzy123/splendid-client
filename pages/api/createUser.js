import { auth } from "../../config/firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
      success: false,
    });
  }

  const { name, email, phone, password } = req.body;
  try {
    const user = await auth.createUser({
      displayName: name,
      email: email,
      phoneNumber: phone,
      password: password,
    });
    return res.status(200).json({
      uid: user.uid,
      success: true,
    });
  } catch (error) {
    console.log("createUser error", error);
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
}
