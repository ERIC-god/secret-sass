import { apps, files } from "@/server/db/schema";
import { AppSubNav } from "./AppSubNav";
import { db } from "@/server/db/db";
import { eq } from "drizzle-orm";

export default async function AppDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const app = await db.select().from(apps).where(eq(apps.id, params.id));
  return (
    <div className="w-full h-full">
      {/* AppName 独立一行，靠左 */}
      <div className="pt-16 pl-56">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent select-none">
          {app[0]?.name}
        </span>
      </div>
      {/* 导航条单独一行，居中 */}
      <AppSubNav appId={params.id} />
      <div className="px-8">{children}</div>
    </div>
  );
}
