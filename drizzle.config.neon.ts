import { defineConfig } from "drizzle-kit";


export default defineConfig({
    schema:"./src/server/db/schema.ts",
    dialect: "postgresql",
    dbCredentials:{
        url:"postgresql://neondb_owner:npg_uM5Axsda0nXJ@ep-polished-poetry-a1f91fgn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    },
    verbose:true,
    strict:true,
})

