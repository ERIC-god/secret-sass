'use client'
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
export default function SettingLayout({
    params: { id },
    children,
}: {
    params: { id: string };
    children: ReactNode;
}) {
    const path = usePathname();
    
    
    return  (
        <div className="flex justify-start container mx-auto">
            <div className="flex flex-col w-60 flex-shrink-0 pt-10 gap-4">
                <Button
                    size="lg"
                    asChild={path !== `/dashboard/apps/${id}/setting/storage`}
                    variant={
                        path === `/dashboard/apps/${id}/setting/storage`
                            ? "outline"
                            : "ghost"
                    }
                    disabled={path === `/dashboard/apps/${id}/setting/storage`}
                >
                    {path !== `/dashboard/apps/${id}/setting/storage` ? (
                        <Link href={`/dashboard/apps/${id}/setting/storage`}>
                            Storage
                        </Link>
                    ) : (
                        "Storage"
                    )}
                </Button>
                <Button
                    size="lg"
                    asChild={path !== `/dashboard/apps/${id}/setting/api-key`}
                    variant={
                        path === `/dashboard/apps/${id}/setting/api-key`
                            ? "outline"
                            : "ghost"
                    }
                    disabled={path === `/dashboard/apps/${id}/setting/api-key`}
                >
                    {path !== `/dashboard/apps/${id}/setting/api-key` ? (
                        <Link href={`/dashboard/apps/${id}/setting/api-key`}>
                            Api Key
                        </Link>
                    ) : (
                        "Api Key"
                    )}
                </Button>
            </div>
            <div className=" flex-grow pl-4">{children}</div>
        </div>
    );

}