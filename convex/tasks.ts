import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getTasks = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('tasks'),
      _creationTime: v.number(),
      text: v.string(),
      isCompleted: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect();
  },
});

export const getTaskById = query({
  args: {
    id: v.id('tasks'),
  },
  returns: v.union(
    v.object({
      _id: v.id('tasks'),
      _creationTime: v.number(),
      text: v.string(),
      isCompleted: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const deleteTaskById = mutation({
  args: {
    id: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const addTask = mutation({
  args: {
    text: v.string(),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('tasks', {
      text: args.text,
      isCompleted: args.isCompleted,
    });
  },
});

export const taskUpdate = mutation({
  args: {
    id: v.id('tasks'),
    text: v.string(),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      text: args.text,
      isCompleted: args.isCompleted,
    });
  },
});
