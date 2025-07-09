import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import z from 'zod';
import {v4 as uuidv4} from 'uuid'
import { db } from "@/server/db/db";
import { eq } from "drizzle-orm";
import { orders, users } from "../db/schema";
import { Stripe } from "stripe";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

export const userRoute = router({
  getPlan: protectedProcedure.query(async ({ ctx }) => {
    const result = await db.query.users.findFirst({
      where: (users) => eq(users.id, ctx.session.user.id),
      columns: {
        plan: true,
      },
    });

    return result?.plan;
  }),

  upgrade: protectedProcedure.mutation(async ({ ctx }) => {
      const stripe = new Stripe(process.env.STRIPE_ID!);

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          // For usage-based billing, don't pass quantity
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `http://localhost:3000/dashboard/pay/success`,
      cancel_url: `http://localhost:3000/dashboard/pay/cancel`,
    });

    // await db.update(users).set({
    //   plan: "payed",
    // });

    if (!session.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    // await db.insert(orders).values({
    //     sessionId: session.id,
    //     userId: ctx.session.user.id,
    //     status: "created",
    // });

    return {
      url: session.url,
    };
  }),
  userLogout: protectedProcedure.mutation(async () => {
    const cookieStore = cookies();
    // 获取所有 cookie
    const allCookies = cookieStore.getAll();
    // 遍历清空
    allCookies.forEach((cookie) => {
      cookieStore.set(cookie.name, "", { expires: new Date(0), path: "/" });
    });
  }),
});