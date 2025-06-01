/**
 *  drizzle-orm 和 zod 联合
 *  通过 drizzle-zod库 来实现 通过schema来创造出对应的 zodObject
 */

import {createInsertSchema,createSelectSchema} from 'drizzle-zod'
import { files, users } from "./schema";

export const createUserSchema = createInsertSchema(users, {
  name: (schema) => schema.min(5),
});

export const fileSchema = createSelectSchema(files);
export const filesCanOrderByColumns = fileSchema.pick({
  createAt: true,
  deleteAt: true,
});