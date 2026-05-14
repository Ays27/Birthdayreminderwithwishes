import { db } from "@/db";
import { users } from "@/db/schema/users";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      id: uuid(),
      email,
      password: hashedPassword,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}