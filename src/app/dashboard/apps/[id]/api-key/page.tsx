// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { trpcClientReact } from "@/utils/client";
// import { Plus } from "lucide-react";
// import React, { useState } from "react";

// export default function Page({ params: { id } }: { params: { id: string } }) {
//   const [newApikeyName, setNewApikeyName] = useState<string>("");
//   const { data: apiKeys } = trpcClientReact.apiKey.listapiKeys.useQuery({
//     appId: id,
//   });
//   const utils = trpcClientReact.useUtils();

//   const { mutate } = trpcClientReact.apiKey.createapiKey.useMutation({
//     onSuccess: (data, {}) => {
//       utils.apiKey.listapiKeys.setData({ appId: id }, (pre) => {
//         setNewApikeyName("");
//         if (!pre || !data) {
//           return pre;
//         }
//         return [data, ...pre];
//       });
//     },
//   });

//   return (
//     <div className="pt-10">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl mb-6">Api Keys</h1>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button>
//               <Plus></Plus>
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent>
//             <div className="flex flex-col gap-4">
//               <Input
//                 placeholder="Name"
//                 onInput={(e: React.FormEvent<HTMLInputElement>) => {
//                   setNewApikeyName((e.target as HTMLInputElement).value);
//                 }}
//               ></Input>
//               <Button
//                 type="submit"
//                 onClick={() => {
//                   mutate({
//                     appId: id,
//                     name: newApikeyName,
//                   });
//                 }}
//               >
//                 Submit
//               </Button>
//             </div>
//           </PopoverContent>
//         </Popover>
//       </div>

//       <div>
//         {apiKeys?.map((apiKey) => {
//           return (
//             <div key={apiKey.id} className=" flex justify-between">
//               <span>{apiKey.name}</span>
//               <span>{apiKey.key}</span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpcClientReact } from "@/utils/client";
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import copy from "copy-to-clipboard";
import { toast } from "sonner";

export default function ApiKeyPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [newApikeyName, setNewApikeyName] = useState<string>("");
  const [showKeyId, setShowKeyId] = useState<number | null>(null);

  const { data: apiKeys, isPending } =
    trpcClientReact.apiKey.listapiKeys.useQuery({
      appId: id,
    });
  const utils = trpcClientReact.useUtils();

  // 创建 key
  const { mutate: createKey } = trpcClientReact.apiKey.createapiKey.useMutation(
    {
      onSuccess: (data, {}) => {
        utils.apiKey.listapiKeys.setData({ appId: id }, (pre) => {
          setNewApikeyName("");
          if (!pre || !data) {
            return pre;
          }
          return [data, ...pre];
        });
        toast.success("API Key created!", { position: "top-center" });
      },
    }
  );

  const { mutate: deleteKey } = trpcClientReact.apiKey.deleteapiKey.useMutation(
    {
      onSuccess: (_data, { id: deletedId }) => {
        utils.apiKey.listapiKeys.setData({ appId: id }, (pre) => {
          if (!pre) return pre;
          return pre.filter((k) => k.id !== deletedId);
        });
        toast.success("API Key deleted!", { position: "top-center" });
      },
    }
  );

  // 快速复制
  const quickCopyValue = "UPLOADING_TOKEN='eyJhcG...'";
  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-extrabold text-white mb-1">API Keys</h2>
        <div className="text-gray-400 mb-8">
          View and manage your UploadThing API keys.
        </div>
        {/* 快速复制 */}
        <div className="bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-xl shadow-lg border border-[#35356a] p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white">Quick Copy</span>
            <Button
              size="sm"
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-4 py-1 rounded-lg shadow hover:scale-105 transition"
              onClick={() => {
                copy(quickCopyValue);
                toast.success("Copied!", { position: "top-center" });
              }}
            >
              <Copy className="w-4 h-4 mr-1" /> Copy
            </Button>
          </div>
          <div className="bg-black/80 text-green-400 font-mono rounded p-3 text-sm overflow-x-auto">
            {quickCopyValue}
          </div>
        </div>
        {/* 标题和创建按钮分开 */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-white">Standard Keys</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-4 py-1 rounded-lg shadow hover:scale-105 transition"
              >
                <Plus className="w-4 h-4 mr-1" /> Create Key
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Name"
                  value={newApikeyName}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    setNewApikeyName((e.target as HTMLInputElement).value);
                  }}
                />
                <Button
                  type="submit"
                  onClick={() => {
                    if (!newApikeyName.trim()) {
                      toast.error("Please enter a name");
                      return;
                    }
                    createKey({
                      appId: id,
                      name: newApikeyName,
                    });
                  }}
                >
                  Submit
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* 表格区 */}
        <div className="bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-xl shadow-lg border border-[#35356a] p-6 mt-2">
          <table className="w-full text-left table-fixed">
            <colgroup>
              <col className="w-1/4" />
              <col className="w-2/4" />
              <col className="w-1/4" />
              <col style={{ width: "60px" }} />
            </colgroup>
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-center">Key</th>
                <th className="py-2 text-center">Created</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-8">
                    Loading...
                  </td>
                </tr>
              ) : apiKeys && apiKeys.length > 0 ? (
                apiKeys.map((k) => (
                  <tr
                    key={k.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-2 text-white">{k.name}</td>
                    <td className="py-2 text-center">
                      <span className="bg-black/60 text-white px-2 py-1 rounded font-mono text-xs mr-2 inline-block">
                        {showKeyId === k.id
                          ? k.key
                          : k.key.replace(/.(?=.{6})/g, "*")}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setShowKeyId(showKeyId === k.id ? null : k.id)
                        }
                        title={showKeyId === k.id ? "Hide" : "Show"}
                      >
                        {showKeyId === k.id ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </td>
                    <td className="py-2 text-gray-300 text-center">
                      {k.createdAt}
                    </td>
                    <td className="py-2 flex gap-2 justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          copy(k.key);
                          toast.success("Copied!", { position: "top-center" });
                        }}
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteKey({ id: k.id })}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-pink-400" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-8">
                    No API Keys found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
