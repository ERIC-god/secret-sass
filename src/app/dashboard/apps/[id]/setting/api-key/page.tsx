"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpcClientReact } from "@/utils/client";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function page({ params: { id } }: { params: { id: string } }) {
  const [newApikeyName,setNewApikeyName]=useState<string>('')
  const { data: apiKeys } = trpcClientReact.apiKey.listapiKeys.useQuery({
    appId: id,
  });
  const utils=trpcClientReact.useUtils()
  
  const {mutate}=trpcClientReact.apiKey.createapiKey.useMutation({
    onSuccess:(data,{})=>{
        utils.apiKey.listapiKeys.setData({appId:id},(pre)=>{
          setNewApikeyName('')
          if(!pre||!data){
            return pre
          }
          return [data,...pre]
        })
    }
  })
 
  


  return (
    <div className="pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Api Keys</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <Plus></Plus>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-4">
              <Input placeholder="Name" onInput={(e:React.FormEvent<HTMLInputElement>)=>{
                  setNewApikeyName((e.target as HTMLInputElement).value)
              }}></Input>
              <Button type="submit" onClick={()=>{
                mutate({
                  appId:id,
                  name:newApikeyName
                })
              }} >Submit</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        {apiKeys?.map((apiKey) => {
          return <div key={apiKey.id} className=" flex justify-between">
              <span>{apiKey.name}</span>
              <span>{apiKey.key}</span>
          </div>
        })}
      </div>
    </div>
  );
}
