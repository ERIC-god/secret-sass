"use client";
import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useEffect, useRef, useState } from "react";
import { trpcClient, trpcClientReact } from "@/utils/client";
import { useUppyState } from "../../useUppyState";
import { UploadPreview } from "@/components/packaging/UploadPreview";
import { Button } from "@/components/ui/button";
import { MoveUp, MoveDown, Trash2, Copy } from "lucide-react";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function AppPage({
  params: { id: appId },
}: {
  params: { id: string };
}) {
  /** uppy初始化(useState 惰性初始) */
  const [uppy] = useState(() => {
    const uppy = new Uppy();
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
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

  /** 它的作用是获取一组用于操作 tRPC 缓存的工具方法 */
  const utils = trpcClientReact.useUtils();

  /** 删除图片接口 */
  const { mutate: deleteFileMutation, isSuccess } =
    trpcClientReact.file.deleteFile.useMutation();

  /** 将deletd At数据变为null */
  // const deleteAtNull = trpcClientReact.file.setDeletedNull.useMutation();

  /** 查询列表接口 */
  // const { data: fileList, isPending } =
  //   trpcClientReact.file.listFiles.useQuery();

  const [isDesc, setIsDesc] = useState<Boolean>(true);
  const result = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(
    {
      limit: 4,
      orderBy: { field: "createAt", order: isDesc ? "desc" : "asc" },
      appId,
    },
    {
      /**
       *  getNextPageParam 是 React Query（或 tRPC 的 useInfiniteQuery）分页查询的一个配置项
       *  用于告诉 React Query 下一页请求时要用什么参数。
       *
       *  这里 res.nextCursor 是后端返回的“下一页的游标”。React Query 会把这个值作为参数，自动传给下一次 API 请求。
       */
      getNextPageParam: (res) => res.nextCursor,
    }
  );

  const { data: infinityQueryData, isPending, fetchNextPage } = result;

  /** id去重 */
  const fileList = infinityQueryData
    ? Array.from(
        new Map(
          infinityQueryData.pages
            .flatMap((page) => page.items)
            .map((item) => [item.id, item])
        ).values()
      )
    : [];

  // console.log(fileList, ":fileList");
  // console.log(infinityQueryData, ":infinityQueryData");

  // const files = useUppyState(uppy, (s) => Object.values(s.files));
  const uppyFiles = useUppyState(uppy, (s) => s.files);
  const [uploadingFileIDs, setuploadingFileIDs] = useState<string[]>([]);

  /** 监听uppy */
  useEffect(() => {
    const handler = (file: any, res: any) => {
      console.log(file, res);
      if (file) {
        trpcClient.file.saveFile
          .mutate({
            name: file.data instanceof File ? file.data.name : "test",
            filePath: res.uploadURL,
            type: file.data.type,
            appId,
          })
          .then((res) => {
            console.log(res);

            /**
             *  手动把新数据 res 加到 file.listFiles 的缓存列表最前面。
             *  这样页面上用 useQuery 读取 file.listFiles 的地方会立即看到最新的数据，不用等接口重新请求。
             */
            // utils.file.listFiles.setData(void 0, (pre) => {
            //   console.log("pre", pre);
            //   console.log("res", res);

            //   if (!pre) {
            //     return pre;
            //   }
            //   return [res, ...pre];
            // });

            /** 这段代码就是把新数据插到第一页最前面，实现“前插”效果。 */
            utils.file.infinityQueryFiles.setInfiniteData(
              {
                limit: 4,
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
      console.log(uploadID, files);
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

  /**
   *  使用 原生 Intersection API 监听触底反弹
   */
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (bottomRef.current) {
      /**
       *  fileList 是 React 的 state，observer 回调只捕获了注册时的那一份，不会自动变。
       */
      const observer = new IntersectionObserver(
        (e) => {
          fetchNextPage();
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
  }, [bottomRef.current]);

  return (
    <div className="flex-1">
      <input
        type="file"
        title="按钮"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile({
                data: file,
                name: file.name,
                type: file.type,
                source: "file input",
              });
            });
          }
        }}
      />
      {/* 升降序按钮 */}
      <Button
        onClick={() => {
          setIsDesc((pre) => !pre);
        }}
        className="m-4"
      >
        {isDesc ? <MoveDown></MoveDown> : <MoveUp></MoveUp>}
      </Button>
      {/* {files.map((file: any) => {
        const url = URL.createObjectURL(file.data);
        return (
          <>
            <img src={url} key={file.id}></img>
            {url}
          </>
        );
      })} */}

      {/* 上传按钮 */}
      <Button
        onClick={() => {
          uppy.upload();
        }}
      >
        Upload
      </Button>

      <Button asChild className="m-2">
        <Link href="/dashboard/apps/new">new App</Link>
      </Button>

      <Button asChild>
        <Link href={`/dashboard/apps/${appId}/storage`}>
          <Settings></Settings>
        </Link>
      </Button>

      {uploadingFileIDs.length > 0 &&
        uploadingFileIDs.map((id: any) => {
          const file = uppyFiles[id];

          const url = URL.createObjectURL(file.data);
          return (
            <div key={file.id}>
              <img src={url} alt=""></img>
            </div>
          );
        })}

      <div>
        {fileList?.map((file: any, index) => {
          return (
            <div key={file.id}>
              <span>{index}</span>
              {/* 删除文件按钮 */}
              <Button
                variant="ghost"
                onClick={() => {
                  deleteFileMutation(file.id);
                }}
              >
                <Trash2></Trash2>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  copy(file.url);
                  toast("this URL has been copied successfully", {
                    position: "top-center",
                  });
                }}
              >
                <Copy />
              </Button>
              <img src={`../../../image/${file.id}`} alt=""></img>
              {/* <img src={file.url} alt=""></img> */}
            </div>
          );
        })}
        <div ref={bottomRef} className="w-full"></div>
      </div>

      <UploadPreview uppy={uppy}></UploadPreview>

      {/* <Button
        onClick={() => {
          deleteAtNull.mutate();
        }}
      >
        HI
      </Button> */}
    </div>
  );
}
