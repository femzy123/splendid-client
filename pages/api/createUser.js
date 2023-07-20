import { auth } from "../../config/firebase-admin";

export default async function handler(req, res) {
  const { name, email, phone, password } = req.body;
  console.log("Body", req.body)
  try {
    const user = await auth.createUser({
      displayName: name,
      email: email,
      phoneNumber: phone,
      password: password,
    });
    res.status(200).json(user);
  } catch (error) {
    console.log("createUser error",error)
    res.json({
      message: error.message,
      success: false,
    });
  }
}
