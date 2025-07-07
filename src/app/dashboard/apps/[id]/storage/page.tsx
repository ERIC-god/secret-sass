// "use client";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
// import { trpcClientReact } from "@/utils/client";
// import { Plus } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// export default function storagePage({
//   params: { id },
// }: {
//   params: { id: string };
// }) {
//   const { data: storages } = trpcClientReact.storage.listStorages.useQuery();
//   const { data: apps, isPending } = trpcClientReact.app.listApps.useQuery();

//   /** 它的作用是获取一组用于操作 tRPC 缓存的工具方法 */
//   const utils = trpcClientReact.useUtils();
//   const {mutate}=trpcClientReact.storage.changeStore.useMutation({
//     onSuccess:(data,{appId,storageId})=>{
//         utils.app.listApps.setData(void 0,(pre)=>{
//             if (!pre) {
//                 return pre;
//             }
//             return pre.map((p)=>{
//                 return p.id===appId ? {...p,storageId} :p
//             })
//          })
//     }
//   })

//   const currentApp = apps?.filter((app) => app.id === id)[0];

//   return (
//     <div>
//       <div className="pt-10">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl mb-6">Storage</h1>
//           <Button asChild>
//             <Link href={`/dashboard/apps/${id}/storage/new`}>
//               <Plus></Plus>
//             </Link>
//           </Button>
//         </div>
//         <Accordion type="single" collapsible>
//           {storages?.map((storage) => {
//             return (
//               <AccordionItem key={storage.id} value={storage.id.toString()}>
//                 <AccordionTrigger
//                   className={
//                     storage.id === currentApp?.storageId
//                       ? "text-destructive"
//                       : ""
//                   }
//                 >
//                   {storage.name}
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <div className="text-lg mb-6">
//                     <div className="flex justify-between items-center">
//                       <span>bucket</span>
//                       <span>{storage.configuration.bucket}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>accessKeyId</span>
//                       <span>{storage.configuration.accessKeyId}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>secretAccessKey</span>
//                       <span>{storage.configuration.secretAccessKey}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>region</span>
//                       <span>{storage.configuration.region}</span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <span>apiEndpoint</span>
//                       <span>{storage.configuration.apiEndpoint}</span>
//                     </div>
//                   </div>
//                   <Button
//                     disabled={storage.id === currentApp?.storageId}
//                     onClick={() => {
//                         mutate({
//                             appId: id,
//                             storageId: storage.id,
//                         });
//                     }}
//                   >
//                     {storage.id === currentApp?.storageId ? "Used" : "Use"}
//                   </Button>
//                 </AccordionContent>
//               </AccordionItem>
//             );
//           })}
//         </Accordion>
//       </div>
//     </div>
//   );
// }

"use client";
import { ConfirmDangerModal } from "@/components/packaging/ConfirmDangerModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { trpcClientReact } from "@/utils/client";
import { Plus, CheckCircle2, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export default function StoragePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [open, setOpen] = useState(false);
  const [storageId, setStorageId] = useState<number>(0);

  const { data: storages } = trpcClientReact.storage.listStorages.useQuery();
  const { data: apps, isPending: isStoragesPending } =
    trpcClientReact.app.listApps.useQuery();

  const utils = trpcClientReact.useUtils();
  const { mutate } = trpcClientReact.storage.changeStore.useMutation({
    onSuccess: (data, { appId, storageId }) => {
      utils.app.listApps.setData(void 0, (pre) => {
        toast.success("Change Success!", {
          position: "top-center",
          style: { top: "50px" },
        });

        if (!pre) return pre;
        return pre.map((p) => (p.id === appId ? { ...p, storageId } : p));
      });
    },
  });

  const { mutate: deleteStore } =
    trpcClientReact.storage.deleteStore.useMutation({
      onSuccess: (data, { id: deletedId }) => {
        utils.storage.listStorages.setData(void 0, (pre) => {
          if (!pre) return pre;
          return pre.filter((s) => s.id !== deletedId);
        });

        toast.success("Delete Success!", {
          position: "top-center",
          style: { top: "50px" },
        });
      },
    });

  const currentApp = apps?.find((app) => app.id === id);
  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-1">Storage</h2>
            <div className="text-gray-400">
              Manage your cloud storage configurations for this app.
            </div>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            <Link href={`/dashboard/apps/${id}/storage/new`}>
              <Plus className="w-5 h-5 mr-1" /> Add Storage
            </Link>
          </Button>
        </div>

        {/* 加载中状态 */}
        {isStoragesPending && (
          <div className="w-full flex flex-col items-center py-20">
            <div className="text-lg text-white font-bold mb-1">Loading...</div>
          </div>
        )}

        {/* 空状态 */}
        {!isStoragesPending && (!storages || storages.length === 0) && (
          <div className="w-full flex flex-col items-center py-20">
            <CheckCircle2 className="w-10 h-10 text-blue-400 mb-2" />
            <div className="text-lg text-white font-bold mb-1">
              No storage found
            </div>
            <div className="text-gray-400 mb-4">
              Click "Add Storage" to create your first storage configuration.
            </div>
          </div>
        )}

        {/* Storage Accordion */}
        <Accordion type="single" collapsible>
          {storages?.map((storage) => (
            <AccordionItem
              key={storage.id}
              value={storage.id.toString()}
              className={`
                mb-6 rounded-2xl shadow-lg border border-[#35356a] 
                bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] 
                overflow-hidden
                ${
                  storage.id === currentApp?.storageId
                    ? "ring-2 ring-pink-400/60"
                    : ""
                }
              `}
            >
              {/* 头部：名称+删除按钮 */}
              <div className="flex items-center justify-between">
                <AccordionTrigger
                  className={`
                    flex items-center gap-2 px-6 py-4 text-lg font-bold
                    ${
                      storage.id === currentApp?.storageId
                        ? "text-pink-400"
                        : "text-white"
                    }
                  `}
                >
                  {storage.name}
                  {storage.id === currentApp?.storageId && (
                    <CheckCircle2 className="w-5 h-5 text-pink-400 ml-2" />
                  )}
                </AccordionTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  className="mr-4 hover:bg-pink-500/20"
                  onClick={() => {
                    // TODO: 删除 storage 的逻辑
                    setOpen(true);
                    setStorageId(storage.id);
                  }}
                >
                  <Trash2 className="w-5 h-5 text-pink-400" />
                </Button>
              </div>
              <AccordionContent>
                <div className="px-6 pb-6 pt-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <span className="font-semibold text-white w-40">
                        Bucket
                      </span>
                      <span className="break-all text-gray-200">
                        {storage.configuration.bucket}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <span className="font-semibold text-white w-40">
                        AccessKeyId
                      </span>
                      <span className="break-all text-gray-200">
                        {storage.configuration.accessKeyId}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <span className="font-semibold text-white w-40">
                        SecretAccessKey
                      </span>
                      <span className="break-all text-gray-200">
                        {storage.configuration.secretAccessKey}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <span className="font-semibold text-white w-40">
                        Region
                      </span>
                      <span className="break-all text-gray-200">
                        {storage.configuration.region}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <span className="font-semibold text-white w-40">
                        ApiEndpoint
                      </span>
                      <span className="break-all text-gray-200">
                        {storage.configuration.apiEndpoint}
                      </span>
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
                    className={`w-full py-3 rounded-lg font-bold text-lg ${
                      storage.id === currentApp?.storageId
                        ? "bg-gray-600 text-white"
                        : "bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white shadow-lg hover:scale-105 transition"
                    }`}
                  >
                    {storage.id === currentApp?.storageId ? "In Use" : "Use"}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <ConfirmDangerModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => {
            // 这里写你的删除逻辑
            deleteStore({ id: storageId });
          }}
          title="Are you sure you want to delete your account?"
          description="This action cannot be undone. All your data will be permanently deleted. Please type DELETE to confirm."
          confirmKeyword="DELETE"
          confirmButtonText="Delete Account"
          cancelButtonText="Cancel"
        />
      </div>
    </div>
  );
}


