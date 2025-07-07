import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  varchar,
  serial,
  json,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import type { AdapterAccount } from "next-auth/adapters";
import { relations } from "drizzle-orm";
import { number } from "zod";

// const connectionString = "postgres://postgres:123123@localhost:5432/drizzle";
// const pool = postgres(connectionString, { max: 1 });
// pool.unsafe('SET timezone="Asia/Shanghai";').then(() => {
//   console.log("时区已设置为 Asia/Shanghai");
// });

/**
 *  users表
 */
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  plan: text("plan", { enum: ["free", "payed"] }),
  image: text("image"),
});

// export const usersRelations = relations(users, ({ many }) => ({
//   files: many(files),
//   apps: many(apps),
//   storages: many(storageConfiguration),
// }));

/**
 *  accounts表
 */
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

/**
 *  apps表
 */
export const apps = pgTable("apps", {
  id: uuid("id").notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  createAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  deleteAt: timestamp("delete_at", { mode: "date" }),
  userId: text("user_id").notNull(),
  storageId: integer("storage_id"),
});

// export const appRelations = relations(apps, ({ one, many }) => ({
//   user: one(users, { fields: [apps.userId], references: [users.id] }),
//   storage: one(storageConfiguration, {
//     fields: [apps.storageId],
//     references: [storageConfiguration.id],
//   }),
//   files: many(files),
// }));

/**
 *  files表
 */
export const files = pgTable(
  "files",
  {
    /** 
   * 这行代码可以拆解为：
  id: - 这是 JavaScript 对象的属性名，它定义了你在代码中引用这个字段时使用的名称。
  uuid("id") - 这里的 "id" 是传递给 uuid() 函数的参数，表示数据库中的列名。
   */
    id: uuid("id").notNull().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    size: integer("size").notNull(),
    createAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    deleteAt: timestamp("delete_at", { mode: "date" }),
    path: varchar("path", { length: 1024 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    userId: text("user_id").notNull(),
    contentType: varchar("content_type", { length: 100 }).notNull(),
    appId: uuid("app_id").notNull(),
    route: varchar("route", { length: 100 }).notNull(),
  }
  // (table) => ({
  //   cursorIdx: index("cursor_idx").on(table.id, table.createAt),
  // })
);

/**
 *  
    one(targetTable, { 
      fields: [当前表的外键字段], 
      references: [目标表的主键字段] 
    })
 */
// export const filesRelations = relations(files, ({ one }) => ({
//   user: one(users, { fields: [files.userId], references: [users.id] }),
//   app: one(apps, { fields: [files.appId], references: [apps.id] }),
// }));

/**
 *  storegeConfiguration表
 */
export type S3StorageConfiguration = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  apiEndpoint: string;
};

export const storageConfiguration = pgTable("storageConfiguration", {
  id: serial("id").primaryKey(), // serial() 自增
  name: varchar("name", { length: 100 }).notNull(),
  userId: text("user_id").notNull(),
  configuration: json("configuration")
    .$type<S3StorageConfiguration>()
    .notNull(),
  createAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  deleteAt: timestamp("delete_at", { mode: "date" }),
});

/** apiKeys表 */
export const apiKeys = pgTable("apiKeys", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  // clientId: varchar("clientId", { length: 100 }).notNull().unique(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  appId: uuid("appId").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

// export const storageConfigurationRelation = relations(
//   storageConfiguration,
//   ({ one }) => ({
//     user: one(users, {
//       fields: [storageConfiguration.userId],
//       references: [users.id],
//     }),
//   })
// );

/** orders表 */
export const orders = pgTable("orders", {
  sessionId: varchar("sessionId", { length: 255 }).primaryKey(),
  status: varchar("status", {
      enum: ["created", "canceled", "completed"],
  }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  userId: text("id").notNull(),
});


export const usersRelations = relations(users, ({ many }) => ({
  files: many(files),
  apps: many(apps),
  storages: many(storageConfiguration),
}));

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, { fields: [files.userId], references: [users.id] }),
  app: one(apps, { fields: [files.appId], references: [apps.id] }),
}));

export const appRelations = relations(apps, ({ one, many }) => ({
  user: one(users, { fields: [apps.userId], references: [users.id] }),
  storage: one(storageConfiguration, {
    fields: [apps.storageId],
    references: [storageConfiguration.id],
  }),
  files: many(files),
}));

export const storageConfigurationRelation = relations(
  storageConfiguration,
  ({ one }) => ({
    user: one(users, {
      fields: [storageConfiguration.userId],
      references: [users.id],
    }),
  })
);

export const apiKeysRelation = relations(apiKeys, ({ one }) => ({
  app: one(apps, { fields: [apiKeys.appId], references: [apps.id] }),
}));







/**
 *  files: many(files) 的详细解释
      这定义了从 apps 表到 files 表的一对多关系：
      每个应用(app)可以有多个文件(file)
      外键应该存在于 files 表中(如 appId)
      这个外键指向 apps 表的 id 字段

    为什么可以简写：  
      因为外键不在当前表(apps)中，而在关联表(files)中
      Drizzle 会自动在 files 表中寻找指向 apps 表的外键
      前提是你已经在 files 表中定义了对应的关系
 */