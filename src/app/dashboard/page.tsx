'use client'
import {Uppy} from "@uppy/core";
import AWSS3 from '@uppy/aws-s3';
import { useState } from "react";
import { trpcClient } from "@/utils/client";
import { useUppyState } from "./useUppyState";


export default function Dashboard(){
    const [uppy]=useState(()=>{
        const uppy=new Uppy();
            uppy.use(AWSS3,{
                shouldUseMultipart:false,
                getUploadParameters(file){
                return trpcClient.file.createPresignedUrl.mutate({
                    filename:file.data instanceof File
                    ? file.data.name
                    : "test",
                    contentType:file.type!,
                    size:file.size!,
                   })
                }
            })
        return uppy;
    })

    const files=useUppyState(uppy,(s)=>Object.values(s.files))


    return (
        <div>
           <input type="file" title="按钮" 
           onChange={(e)=>{
            if(e.target.files){
                Array.from(e.target.files).forEach((file)=>{
                    uppy.addFile(
                       { 
                        data:file,
                        name:file.name,
                        type: file.type,
                        source: 'file input',
                       }
                    )
                })
            }
           }}/>
           {
            files.map((file:any)=>{
                const url=URL.createObjectURL(file.data);
                return <img src={url} key={file.id}></img>
            }) 
           }
           <button onClick={()=>{
                uppy.upload()
           }}>
                Upload
           </button>
        </div>
    )
}

