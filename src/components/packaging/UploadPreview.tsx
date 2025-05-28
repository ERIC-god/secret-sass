'use client'
import Uppy from "@uppy/core";

/**
 *  对Dialog进行二次封装
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUppyState } from "@/app/dashboard/useUppyState";
import { Button } from "../ui/button";
import { ChevronLeft,ChevronRight } from "lucide-react";


export function UploadPreview({ uppy }: { uppy: Uppy }) {

/** 通过uppy联动 Dialog */
//  const open=useUppyState(uppy,s=>Object.keys(s.files).length>0)
 const files=useUppyState(uppy,s=>Object.values(s.files))
 const open= files.length > 0
    
  return (
    <Dialog >
        <DialogContent>
            <DialogTitle>Upload Preview</DialogTitle>
            <div className="flex items-center justify-between">
            <Button variant='ghost'>
                <ChevronLeft/>
            </Button>
            {   
                files.map((file:any)=>{
                    const url=URL.createObjectURL(file.data)
                    return (
                        <div key={file.id}>
                            <img src={url} alt={file.name}></img>
                        </div>
                    )
                })
            }    
            <Button variant='ghost'>
                <ChevronRight/>
            </Button>
        
            </div>  
                
        </DialogContent>
  </Dialog>
  )
}



