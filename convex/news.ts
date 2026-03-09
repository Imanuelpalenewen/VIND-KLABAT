import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── getNews (Dev 2 — feat/student-news) ─────────────────────────────────────
export const getNews = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    let news = await ctx.db
      .query("news")
      .withIndex("by_date")
      .order("desc")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    if (category) {
      news = news.filter((n) => n.category === category);
    }

    return news.map((n) => ({
      _id: n._id,
      title: n.title,
      summary: n.summary,
      content: n.content,
      category: n.category,
      date: n.date,
      imageUrl: n.imageUrl,
    }));
  },
});

// ─── createNews (admin/seed) ──────────────────────────────────────────────────
export const createNews = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    content: v.string(),
    category: v.string(),
    date: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("news", {
      title: args.title,
      summary: args.summary,
      content: args.content,
      category: args.category,
      date: args.date,
      imageUrl: args.imageUrl,
      isPublished: true,
    });
    return { success: true };
  },
});
