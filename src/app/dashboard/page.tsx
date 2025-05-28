'use client'
import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useEffect, useState } from "react";
import { trpcClient, trpcClientReact } from "@/utils/client";
import { useUppyState } from "./useUppyState";
import { UploadPreview } from "@/components/packaging/UploadPreview";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
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
        });
      },
    });
    return uppy;
  });

  /** 它的作用是获取一组用于操作 tRPC 缓存的工具方法 */
  const utils = trpcClientReact.useUtils();

  /** 查询列表接口 */
  const { data: fileList, isPending } =
    trpcClientReact.file.listFiles.useQuery();
  console.log("update");

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
          })
          .then((res) => {
            console.log(res);

            /**
             *  手动把新数据 res 加到 file.listFiles 的缓存列表最前面。
             *  这样页面上用 useQuery 读取 file.listFiles 的地方会立即看到最新的数据，不用等接口重新请求。
             */
            utils.file.listFiles.setData(void 0, (pre) => {
              console.log("pre", pre);
              console.log("res", res);

              if (!pre) {
                return pre;
              }
              return [res, ...pre];
            });
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

  return (
    <div>
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

      {/* {files.map((file: any) => {
        const url = URL.createObjectURL(file.data);
        return (
          <>
            <img src={url} key={file.id}></img>
            {url}
          </>
        );
      })} */}
      <Button
        onClick={() => {
          uppy.upload();
        }}
      >
        Upload
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

      {fileList?.map((file: any, index) => {
        return (
          <div key={file.id}>
            <img src={file.url} alt=""></img>
          </div>
        );
      })}

      <UploadPreview uppy={uppy}></UploadPreview>
    </div>
  );
}

