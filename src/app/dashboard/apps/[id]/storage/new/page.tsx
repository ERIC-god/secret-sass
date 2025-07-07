// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { type S3StorageConfiguration } from "@/server/db/schema";
// import { trpcClientReact } from "@/utils/client";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";

// export default function StoragePage({
//     params: { id },
// }: {
//     params: { id: string };
// }) {
//     const router = useRouter();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<S3StorageConfiguration & { name: string }>();

//     const {mutate} = trpcClientReact.storage.createStorages.useMutation()
    

//     const onSubmit: SubmitHandler<S3StorageConfiguration & { name: string }> = (
//         data
//     ) => {
//         console.log("submit");
//         mutate(data);
//         router.push(`/dashboard/apps/${id}/setting/storage`);
//     };

//     return (
//         <div className="container pt-10">
//             <h1 className="text-3xl mb-6 max-w-md mx-auto">Create Storage</h1>
//             <form
//                 className="flex flex-col gap-4 max-w-md mx-auto"
//                 onSubmit={handleSubmit(onSubmit)}
//             >
//                 <div>
//                     <Label>Name</Label>
//                     <Input
//                         {...register("name", {
//                             required: "Name is required",
//                         })}
//                     ></Input>
//                     <span className="text-red-500">{errors.name?.message}</span>
//                 </div>
//                 <div>
//                     <Label>Bucket</Label>
//                     <Input
//                         {...register("bucket", {
//                             required: "Bucket is required",
//                         })}
//                     ></Input>
//                     <span className="text-red-500">
//                         {errors.bucket?.message}
//                     </span>
//                 </div>
//                 <div>
//                     <Label>AccessKeyId</Label>
//                     <Input
//                         {...register("accessKeyId", {
//                             required: "accessKeyId is required",
//                         })}
//                     ></Input>
//                     <span className="text-red-500">
//                         {errors.accessKeyId?.message}
//                     </span>
//                 </div>
//                 <div>
//                     <Label>SecretAccessKey</Label>
//                     <Input
//                         type="password"
//                         {...register("secretAccessKey", {
//                             required: "secretAccessKey is required",
//                         })}
//                     ></Input>
//                     <span className="text-red-500">
//                         {errors.secretAccessKey?.message}
//                     </span>
//                 </div>
//                 <div>
//                     <Label>Regin</Label>
//                     <Input
//                         {...register("region", {
//                             required: "region is required",
//                         })}
                        
//                     ></Input>
//                     <span className="text-red-500">
//                         {errors.region?.message}
//                     </span>
//                 </div>

//                 <div>
//                     <Label>ApiEndpoint</Label>
//                     <Input {...register("apiEndpoint",{
//                          required: "apiEndpoint is required",
//                     })}></Input>
//                     <span className="text-red-500">
//                         {errors.apiEndpoint?.message}
//                     </span>
//                 </div>
//                 <Button type="submit">Submit</Button>
//             </form>
//         </div>
//     );
// }



"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type S3StorageConfiguration } from "@/server/db/schema";
import { trpcClientReact } from "@/utils/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function StoragePage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<S3StorageConfiguration & { name: string }>();

  const { mutate } = trpcClientReact.storage.createStorages.useMutation();

  const onSubmit: SubmitHandler<S3StorageConfiguration & { name: string }> = (
    data
  ) => {
    mutate(data);
    toast.success("Create Storage Success!", {
      position: "top-center",
      style: { top: "50px" },
    });
    setTimeout(() => {
      router.push(`/dashboard/apps/${id}/storage`);
    }, 800);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b]">
      <div className="-mt-60 w-full max-w-lg bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-2xl border border-[#35356a] p-10">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center">
          Create Storage
        </h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label className="text-white">Name</Label>
            <Input
              className="bg-[#1a1a2e] text-white border border-[#3a3a6a] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              {...register("name", {
                required: "Name is required",
              })}
            />
            <span className="text-pink-400 text-sm">
              {errors.name?.message}
            </span>
          </div>
          <div>
            <Label className="text-white">Bucket</Label>
            <Input
              className="bg-[#1a1a2e] text-white border border-[#3a3a6a] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              {...register("bucket", {
                required: "Bucket is required",
              })}
            />
            <span className="text-pink-400 text-sm">
              {errors.bucket?.message}
            </span>
          </div>
          <div>
            <Label className="text-white">AccessKeyId</Label>
            <Input
              className="bg-[#1a1a2e] text-white border border-[#3a3a6a] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              {...register("accessKeyId", {
                required: "accessKeyId is required",
              })}
            />
            <span className="text-pink-400 text-sm">
              {errors.accessKeyId?.message}
            </span>
          </div>
          <div>
            <Label className="text-white">SecretAccessKey</Label>
            <Input
              type="password"
              className="bg-[#1a1a2e] text-white border border-[#3a3a6a] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              {...register("secretAccessKey", {
                required: "secretAccessKey is required",
              })}
            />
            <span className="text-pink-400 text-sm">
              {errors.secretAccessKey?.message}
            </span>
          </div>
          <div>
            <Label className="text-white">Region</Label>
            <Input
              className="bg-[#1a1a2e] text-white border border-[#3a3a6a] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              {...register("region", {
                required: "region is required",
              })}
            />
            <span className="text-pink-400 text-sm">
              {errors.region?.message}
            </span>
          </div>
          <div>
            <Label className="text-white">ApiEndpoint</Label>
            <Input
              className="bg-[#1a1a2e] text-white border border-[#3a3a6a] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              {...register("apiEndpoint", {
                required: "apiEndpoint is required",
              })}
            />
            <span className="text-pink-400 text-sm">
              {errors.apiEndpoint?.message}
            </span>
          </div>
          <Button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white shadow-lg hover:scale-105 transition"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}