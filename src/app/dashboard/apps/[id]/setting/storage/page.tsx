"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { trpcClientReact } from "@/utils/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function storagePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data: storages } = trpcClientReact.storage.listStorages.useQuery();
  const { data: apps, isPending } = trpcClientReact.app.listApps.useQuery();

  /** 它的作用是获取一组用于操作 tRPC 缓存的工具方法 */
  const utils = trpcClientReact.useUtils();
  const {mutate}=trpcClientReact.storage.changeStore.useMutation({
    onSuccess:(data,{appId,storageId})=>{
        utils.app.listApps.setData(void 0,(pre)=>{
            if (!pre) {
                return pre;
            }
            return pre.map((p)=>{
                return p.id===appId ? {...p,storageId} :p
            })
         })
    }
  })
 



  const currentApp = apps?.filter((app) => app.id === id)[0];
  

  return (
    <div>
      <div className="pt-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl mb-6">Storage</h1>
          <Button asChild>
            <Link href={`/dashboard/apps/${id}/setting/storage/new`}>
              <Plus></Plus>
            </Link>
          </Button>
        </div>
        <Accordion type="single" collapsible>
          {storages?.map((storage) => {
            return (
              <AccordionItem key={storage.id} value={storage.id.toString()}>
                <AccordionTrigger
                  className={
                    storage.id === currentApp?.storageId
                      ? "text-destructive"
                      : ""
                  }
                >
                  {storage.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-lg mb-6">
                    <div className="flex justify-between items-center">
                      <span>bucket</span>
                      <span>{storage.configuration.bucket}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>accessKeyId</span>
                      <span>{storage.configuration.accessKeyId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>secretAccessKey</span>
                      <span>{storage.configuration.secretAccessKey}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>region</span>
                      <span>{storage.configuration.region}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>apiEndpoint</span>
                      <span>{storage.configuration.apiEndpoint}</span>
                    </div>
                  </div>
                  <Button
                    disabled={storage.id === currentApp?.storageId}
                    onClick={() => {
                        mutate({
                            appId: id,
                            storageId: storage.id,
                        });
                    }}
                  >
                    {storage.id === currentApp?.storageId ? "Used" : "Use"}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
