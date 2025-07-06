// "use client";
// import { Uppy } from "@uppy/core";
// import AWSS3 from "@uppy/aws-s3";
// import { useEffect, useRef, useState } from "react";
// import { trpcClient, trpcClientReact } from "@/utils/client";
// import { useUppyState } from "../../../useUppyState";
// import { UploadPreview } from "@/components/packaging/UploadPreview";
// import { Button } from "@/components/ui/button";
// import { MoveUp, MoveDown, Trash2, Copy } from "lucide-react";
// import copy from "copy-to-clipboard";
// import { toast } from "sonner";
// import Link from "next/link";
// import { Settings } from "lucide-react";

// export default function AppPage({
//   params: { id: appId },
// }: {
//   params: { id: string };
// }) {

//   const { data: apps, isPending } = trpcClientReact.app.listApps.useQuery(
//     void 0,
//     {
//       /**
//        *  refetchOnReconnect：当网络断开后重新连接时，是否自动重新请求数据。false 表示不会自动重新请求。
//           refetchOnWindowFocus：当窗口重新获得焦点时，是否自动重新请求数据。false 表示不会自动重新请求。
//           refetchOnMount：当组件重新挂载时，是否自动重新请求数据。false 表示不会自动重新请求。
//        */
//       refetchOnReconnect: false,
//       refetchOnWindowFocus: false,
//       refetchOnMount: false,
//     }
//   );

//   const currentApp = apps?.filter((app) => app.id === appId)[0];
//   // const currentApp = results[0];

//   console.log(currentApp);

//   /** uppy初始化(useState 惰性初始) */
//   const [uppy] = useState(() => {
//     const uppy = new Uppy();
//     uppy.use(AWSS3, {
//       shouldUseMultipart: false,
//       getUploadParameters(file) {
//         return trpcClient.file.createPresignedUrl.mutate({
//           filename: file.data instanceof File ? file.data.name : "test",
//           contentType: file.type!,
//           size: file.size!,
//           appId,
//         });
//       },
//     });
//     return uppy;
//   });

//   /** 它的作用是获取一组用于操作 tRPC 缓存的工具方法 */
//   const utils = trpcClientReact.useUtils();

//   /** 删除图片接口 */
//   const { mutate: deleteFileMutation, isSuccess } =
//     trpcClientReact.file.deleteFile.useMutation();

//   /** 将deletd At数据变为null */
//   // const deleteAtNull = trpcClientReact.file.setDeletedNull.useMutation();

//   /** 查询列表接口 */
//   // const { data: fileList, isPending } =
//   //   trpcClientReact.file.listFiles.useQuery();

//   const [isDesc, setIsDesc] = useState<Boolean>(true);
//   const result = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(
//     {
//       limit: 4,
//       orderBy: { field: "createAt", order: isDesc ? "desc" : "asc" },
//       appId,
//     },
//     {
//       /**
//        *  getNextPageParam 是 React Query（或 tRPC 的 useInfiniteQuery）分页查询的一个配置项
//        *  用于告诉 React Query 下一页请求时要用什么参数。
//        *
//        *  这里 res.nextCursor 是后端返回的“下一页的游标”。React Query 会把这个值作为参数，自动传给下一次 API 请求。
//        */
//       getNextPageParam: (res) => res.nextCursor,
//     }
//   );

//   const { data: infinityQueryData, fetchNextPage } = result;

//   /** id去重 */
//   const fileList = infinityQueryData
//     ? Array.from(
//         new Map(
//           infinityQueryData.pages
//             .flatMap((page) => page.items)
//             .map((item) => [item.id, item])
//         ).values()
//       )
//     : [];

//   // console.log(fileList, ":fileList");
//   // console.log(infinityQueryData, ":infinityQueryData");

//   // const files = useUppyState(uppy, (s) => Object.values(s.files));
//   const uppyFiles = useUppyState(uppy, (s) => s.files);
//   const [uploadingFileIDs, setuploadingFileIDs] = useState<string[]>([]);

//   /** 监听uppy */
//   useEffect(() => {
//     const handler = (file: any, res: any) => {
//       console.log(file, res);
//       if (file) {
//         trpcClient.file.saveFile
//           .mutate({
//             name: file.data instanceof File ? file.data.name : "test",
//             filePath: res.uploadURL,
//             type: file.data.type,
//             appId,
//           })
//           .then((res) => {
//             console.log(res);

//             /**
//              *  手动把新数据 res 加到 file.listFiles 的缓存列表最前面。
//              *  这样页面上用 useQuery 读取 file.listFiles 的地方会立即看到最新的数据，不用等接口重新请求。
//              */
//             // utils.file.listFiles.setData(void 0, (pre) => {
//             //   console.log("pre", pre);
//             //   console.log("res", res);

//             //   if (!pre) {
//             //     return pre;
//             //   }
//             //   return [res, ...pre];
//             // });

//             /** 这段代码就是把新数据插到第一页最前面，实现“前插”效果。 */
//             utils.file.infinityQueryFiles.setInfiniteData(
//               {
//                 limit: 4,
//                 orderBy: {
//                   order: "desc",
//                   field: "createAt",
//                 },
//                 appId,
//               },
//               (prev) => {
//                 if (!prev) {
//                   return prev;
//                 }
//                 return {
//                   ...prev,
//                   pages: prev.pages.map((page, index) => {
//                     if (index === 0) {
//                       return {
//                         ...page,
//                         items: [res, ...page.items],
//                       };
//                     }
//                     return page;
//                   }),
//                 };
//               }
//             );
//           });
//       }
//     };

//     const uploadHandler = (uploadID: any, files: any) => {
//       console.log(uploadID, files);
//       files.map((file: any) => {
//         setuploadingFileIDs((pre) => [...pre, file.id]);
//       });
//     };

//     const completeHandler = () => {
//       setuploadingFileIDs([]);
//     };

//     uppy.on("upload-success", handler);
//     uppy.on("upload", uploadHandler);
//     uppy.on("complete", completeHandler);

//     return () => {
//       uppy.off("upload-success", handler);
//       uppy.off("upload", uploadHandler);
//       uppy.off("complete", completeHandler);
//     };
//   }, [uppy]);

//   /**
//    *  使用 原生 Intersection API 监听触底反弹
//    */
//   const bottomRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//     if (bottomRef.current) {
//       /**
//        *  fileList 是 React 的 state，observer 回调只捕获了注册时的那一份，不会自动变。
//        */
//       const observer = new IntersectionObserver(
//         (e) => {
//           fetchNextPage();
//         },
//         { threshold: 0 }
//       );

//       observer.observe(bottomRef.current);
//       const element = bottomRef.current;
//       return () => {
//         observer.unobserve(element);
//         observer.disconnect();
//       };
//     }
//   }, [bottomRef.current]);

//   return (
//     <div className="flex-1">
//       <input
//         type="file"
//         title="按钮"
//         multiple
//         onChange={(e) => {
//           if (e.target.files) {
//             Array.from(e.target.files).forEach((file) => {
//               uppy.addFile({
//                 data: file,
//                 name: file.name,
//                 type: file.type,
//                 source: "file input",
//               });
//             });
//           }
//         }}
//       />
//       {/* 升降序按钮 */}
//       <Button
//         onClick={() => {
//           setIsDesc((pre) => !pre);
//         }}
//         className="m-4"
//       >
//         {isDesc ? <MoveDown></MoveDown> : <MoveUp></MoveUp>}
//       </Button>
//       {/* {files.map((file: any) => {
//         const url = URL.createObjectURL(file.data);
//         return (
//           <>
//             <img src={url} key={file.id}></img>
//             {url}
//           </>
//         );
//       })} */}

//       {/* 上传按钮 */}
//       <Button
//         onClick={() => {
//           uppy.upload();
//         }}
//       >
//         Upload
//       </Button>

//       <Button asChild className="m-2">
//         <Link href="/dashboard/apps/new">new App</Link>
//       </Button>

//       <Button asChild>
//         <Link href={`/dashboard/apps/${appId}/storage`}>
//           <Settings></Settings>
//         </Link>
//       </Button>

//       {uploadingFileIDs.length > 0 &&
//         uploadingFileIDs.map((id: any) => {
//           const file = uppyFiles[id];

//           const url = URL.createObjectURL(file.data);
//           return (
//             <div key={file.id}>
//               <img src={url} alt=""></img>
//             </div>
//           );
//         })}

//       {currentApp ? (
//         <div>
//           {isPending ? (
//             <div>Loading...</div>
//           ) : (
//             fileList?.map((file: any, index) => {
//               return (
//                 <div key={file.id}>
//                   <span>{index}</span>
//                   {/* 删除文件按钮 */}
//                   <Button
//                     variant="ghost"
//                     onClick={() => {
//                       deleteFileMutation(file.id);
//                     }}
//                   >
//                     <Trash2></Trash2>
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     onClick={() => {
//                       copy(file.url);
//                       toast("this URL has been copied successfully", {
//                         position: "top-center",
//                       });
//                     }}
//                   >
//                     <Copy />
//                   </Button>
//                   <img src={`../../../image/${file.id}`} alt=""></img>
//                   {/* <img src={file.url} alt=""></img> */}
//                 </div>
//               );
//             })
//           )}
//           <div ref={bottomRef} className="w-full"></div>
//         </div>
//       ) : (
//         <div>APP NOT FOUND</div>
//       )}

//       <UploadPreview uppy={uppy}></UploadPreview>

//       {/* <Button
//         onClick={() => {
//           deleteAtNull.mutate();
//         }}
//       >
//         HI
//       </Button> */}
//     </div>
//   );
// }



"use client";
import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useEffect, useRef, useState } from "react";
import { trpcClient, trpcClientReact } from "@/utils/client";
import { useUppyState } from "../../../useUppyState";
import { UploadPreview } from "@/components/packaging/UploadPreview";
import { Button } from "@/components/ui/button";
import { MoveUp, MoveDown, Trash2, Copy, Upload } from "lucide-react";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { FileFlowUploadModal } from "./components/FileFlowUploadModal";
import { usePathname } from "next/navigation";

export default function AppPage({
  params: { id: appId },
}: {
  params: { id: string };
}) {
  const { data: apps, isPending } = trpcClientReact.app.listApps.useQuery(
    void 0,
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const currentApp = apps?.filter((app) => app.id === appId)[0];

  // Uppy 初始化
  const [uppy] = useState(() => {
    const uppy = new Uppy();
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        console.log(file);

        return trpcClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : "test",
          contentType: file.type!,
          size: file.size!,
          appId,
        });
      },
    });
    return uppy;
  });

  const utils = trpcClientReact.useUtils();

  // 删除文件
  const { mutate: deleteFileMutation } =
    trpcClientReact.file.deleteFile.useMutation();

  // 排序
  const [isDesc, setIsDesc] = useState<Boolean>(true);

  // 分页
  const result = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(
    {
      limit: 10,
      orderBy: { field: "createAt", order: isDesc ? "desc" : "asc" },
      appId,
    },
    {
      getNextPageParam: (res) => res.nextCursor,
    }
  );

  const {
    data: infinityQueryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = result;

  // id去重
  const fileList = infinityQueryData
    ? Array.from(
        new Map(
          infinityQueryData.pages
            .flatMap((page) => page.items)
            .map((item) => [item.id, item])
        ).values()
      )
    : [];

  // Uppy 状态
  const uppyFilesObj = useUppyState(uppy, (s) => s.files);
  const uppyFiles = Object.values(uppyFilesObj);
  const [uploadingFileIDs, setuploadingFileIDs] = useState<string[]>([]);
  console.log("window.location.hostname", window.location.hostname);

  // Uppy 事件监听
  useEffect(() => {
    const handler = (file: any, res: any) => {
      if (file) {
        trpcClient.file.saveFile
          .mutate({
            name: file.data instanceof File ? file.data.name : "test",
            filePath: res.uploadURL,
            type: file.data.type,
            appId,
            size: file.size,
          })
          .then((res) => {
            console.log(res);

            utils.file.infinityQueryFiles.setInfiniteData(
              {
                limit: 10,
                orderBy: {
                  order: "desc",
                  field: "createAt",
                },
                appId,
              },
              (prev) => {
                if (!prev) {
                  return prev;
                }
                return {
                  ...prev,
                  pages: prev.pages.map((page, index) => {
                    if (index === 0) {
                      return {
                        ...page,
                        items: [res, ...page.items],
                      };
                    }
                    return page;
                  }),
                };
              }
            );
          });
      }
    };

    const uploadHandler = (uploadID: any, files: any) => {
      files.map((file: any) => {
        setuploadingFileIDs((pre) => [...pre, file.id]);
      });
    };

    const completeHandler = () => {
      setuploadingFileIDs([]);
    };

    uppy.on("upload-success", handler);
    uppy.on("upload", uploadHandler);
    uppy.on("complete", completeHandler);

    return () => {
      uppy.off("upload-success", handler);
      uppy.off("upload", uploadHandler);
      uppy.off("complete", completeHandler);
    };
  }, [uppy]);

  // 触底加载
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (bottomRef.current && hasNextPage) {
      const observer = new IntersectionObserver(
        (e) => {
          if (e[0].isIntersecting) fetchNextPage();
        },
        { threshold: 0 }
      );
      observer.observe(bottomRef.current);
      const element = bottomRef.current;
      return () => {
        observer.unobserve(element);
        observer.disconnect();
      };
    }
  }, [bottomRef.current, hasNextPage]);

  // 排序切换
  const handleSort = () => setIsDesc((pre) => !pre);

  // 上传弹窗
  const [showUploadModal, setShowUploadModal] = useState(false);

  // fileList.map((item) => {
  //   console.log(item.data);
  // });

  return (
    <div className="w-full flex flex-col items-center pt-10">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-1">Files</h2>
            <div className="text-gray-400">
              These are all of the files that have been uploaded via your
              uploader.
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition flex items-center gap-2"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="w-5 h-5" /> Upload
          </Button>
        </div>

        {/* 上传弹窗 */}
        <FileFlowUploadModal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          uppy={uppy}
          uploadingFiles={uppyFiles}
          onUpload={() => {
            uppy.upload();
            setShowUploadModal(false);
          }}
        />

        {/* 表格 */}
        <div className="bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-lg border border-[#35356a] overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="px-4 py-3">
                  <input type="checkbox" disabled />
                </th>
                <th className="px-4 py-3 font-bold select-none">
                  <div className="flex items-center gap-1">
                    Name
                    <button
                      className="ml-1 text-blue-400 hover:text-pink-400 transition"
                      onClick={handleSort}
                    >
                      {isDesc ? (
                        <MoveDown className="w-4 h-4" />
                      ) : (
                        <MoveUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold">Route</th>
                <th className="px-4 py-3 font-bold">Size</th>
                <th className="px-4 py-3 font-bold">Uploaded</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {fileList.map((file: any) => (
                <tr
                  key={file.id}
                  className="border-t border-white/10 hover:bg-white/5 transition group"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" />
                  </td>
                  <td className="px-4 py-3 text-white font-medium">
                    {file.name}
                  </td>
                  <td className="px-4 py-3 text-blue-300">
                    {file.route || "—"}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {file.size ? `${(file.size / 1024).toFixed(2)}KB` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {file.createAt
                      ? new Date(file.createAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-green-400">
                    {file.status || "Uploaded"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-blue-500/20"
                      onClick={() => {
                        copy(file.url);
                        toast("File URL copied!", { position: "top-center" });
                      }}
                    >
                      <Copy className="w-5 h-5 text-blue-400" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-pink-500/20"
                      onClick={() => deleteFileMutation(file.id)}
                    >
                      <Trash2 className="w-5 h-5 text-pink-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 分页/加载更多 */}
          <div ref={bottomRef} />
          {hasNextPage && (
            <div className="flex justify-center py-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}