import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Destructure to separate users table from other auth tables
const { users: _baseUsersTable, ...otherAuthTables } = authTables;

export default defineSchema({
  // Include other auth tables first
  ...otherAuthTables,
  // Define tasks table
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  // Define custom users table with the online field
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
});
