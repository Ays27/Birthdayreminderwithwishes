import { db } from "@/db";
import { users } from "@/db/schema/users";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return Response.json(
        { error: "Wrong password" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      userId: user.id,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}