import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const birthdays = pgTable("birthdays", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  wish: text("wish"),
  createdAt: timestamp("created_at").defaultNow(),
});