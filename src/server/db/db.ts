import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleHTTP, NeonHttpDatabase} from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export default function createDB(): NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>{
    if (process.env.NODE_ENV === "production") {
        const neonDBURL = process.env.NEON_DB_URL!;
        const sql = neon(neonDBURL);
        return drizzleHTTP(sql,{schema})
    }
    else{
        const connectionString = postgres("postgres://postgres:123123@localhost:5432/drizzle")
        return drizzle(connectionString,{schema})
    }   
}   

export const db=createDB();



