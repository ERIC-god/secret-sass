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


'use client'
import { Button } from "@/components/ui/button";
import { Copy, Eye, Plus, Trash2 } from "lucide-react";

export default function ApiKeyPage() {
  // 假数据
  const apiKeys = [
    {
      id: "1",
      name: "Main Key",
      key: "sk_live_********************",
      createdAt: "2025/07/06 14:36",
      lastUsed: "3 hours ago"
    }
  ];

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-extrabold text-white mb-1">API Keys</h2>
        <div className="text-gray-400 mb-8">View and manage your UploadThing API keys.</div>
        {/* 快速复制 */}
        <div className="bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-xl shadow-lg border border-[#35356a] p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white">Quick Copy</span>
            <Button size="sm" className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-4 py-1 rounded-lg shadow hover:scale-105 transition">
              <Copy className="w-4 h-4 mr-1" /> Copy
            </Button>
          </div>
          <div className="bg-black/80 text-green-400 font-mono rounded p-3 text-sm overflow-x-auto">
            UPLOADING_TOKEN='eyJhcG...'
          </div>
        </div>
        {/* 表格区 */}
        <div className="bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-xl shadow-lg border border-[#35356a] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-white">Standard Keys</span>
            <Button size="sm" className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-4 py-1 rounded-lg shadow hover:scale-105 transition">
              <Plus className="w-4 h-4 mr-1" /> Create Key
            </Button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="py-2">Name</th>
                <th className="py-2">Key</th>
                <th className="py-2">Created</th>
                <th className="py-2">Last Used</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((k) => (
                <tr key={k.id} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="py-2 text-white">{k.name}</td>
                  <td className="py-2">
                    <span className="bg-black/60 text-white px-2 py-1 rounded font-mono text-xs mr-2">{k.key}</span>
                    <Button size="icon" variant="ghost"><Eye className="w-4 h-4" /></Button>
                  </td>
                  <td className="py-2 text-gray-300">{k.createdAt}</td>
                  <td className="py-2 text-gray-300">{k.lastUsed}</td>
                  <td className="py-2 flex gap-2">
                    <Button size="icon" variant="ghost"><Copy className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost"><Trash2 className="w-4 h-4 text-pink-400" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}