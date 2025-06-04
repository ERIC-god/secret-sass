'use client'
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { trpcClientReact } from "@/utils/client";


export default function AppDashboardNav({
    params: { id },
}: {
    params: { id: string };
}) {
    const { data: apps, isPending } = trpcClientReact.app.listApps.useQuery();

    const currentApp = apps?.filter((app) => app.id === id)[0];
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    {isPending
                        ? "Loading..."
                        : currentApp
                        ? currentApp.name
                        : "..."}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {apps?.map((app) => {
                    return (
                        <DropdownMenuItem key={app.id} disabled={app.id === id} asChild>
                            <Link href={`/dashboard/apps/${app.id}`}>
                                {app.name}
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
