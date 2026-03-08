import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── login ──────────────────────────────────────────────────────────────────────
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("student"), v.literal("lecturer")),
  },
  handler: async (ctx, { email, password, role }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("User not found");
    if (user.role !== role) throw new Error("Invalid role for this account");
    if (user.password !== password) throw new Error("Invalid password");

    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      nim: user.nim,
      program: user.program,
      semester: user.semester,
      nidn: user.nidn,
      department: user.department,
      title: user.title,
    };
  },
});

// ─── getUser ────────────────────────────────────────────────────────────────────
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// ─── getLecturers ───────────────────────────────────────────────────────────────
export const getLecturers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "lecturer"))
      .collect();
  },
});

