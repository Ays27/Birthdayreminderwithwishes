import { db } from "@/db";
import { birthdays } from "@/db/schema/birthdays";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId, name, date, wish } = await req.json();

  await db.insert(birthdays).values({
    id: uuid(),
    userId,
    name,
    date,
    wish,
  });

  return Response.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const data = await db
    .select()
    .from(birthdays)
    .where(eq(birthdays.userId, userId!));

  return Response.json(data);
}

export async function PUT(req: Request) {
  const { id, name, date, wish } = await req.json();

  await db
    .update(birthdays)
    .set({ name, date, wish })
    .where(eq(birthdays.id, id));

  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await db.delete(birthdays).where(eq(birthdays.id, id!));

  return Response.json({ success: true });
}