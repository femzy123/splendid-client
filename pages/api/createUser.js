import { auth } from "../../config/firebase-admin";

export default async function handler(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    const user = await auth.createUser({
      displayName: name,
      email: email,
      phoneNumber: phone,
      password: password,
    });
    res.status(200).json(user);
  } catch (error) {
    res.json({
      message: error.message,
      success: false,
    });
  }
}
