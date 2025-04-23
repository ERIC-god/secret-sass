import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {Users} from './schema';

const queryClient=postgres(
    "postgres://postgres:123123@localhost:5432/postgres"
)

export const db= drizzle(queryClient,
    {
        schema:{Users}
    }
)