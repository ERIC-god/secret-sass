import z from 'zod'
import { NextRequest, NextResponse } from "next/server";
import { createUserSchema } from '@/server/db/validate-schema';


// const inputSchema=z.object({
//     username:z.string().min(3,'账号需要3个字符或以上').max(8),
//     password:z.string().min(3).max(8)
// })

/** request.nextUrl是URL对象  */
export async function POST(request:NextRequest){
   const body=await request.json();
   console.log('-----',request.nextUrl.searchParams.get('id')); 
   const {username,password}=body
    const data={
        id:'12345',
        username,
        password,
        name:'12356'
    }

    /** 通过createUserSchema生成 */
   const result=createUserSchema.safeParse(data)
   console.log(result);
   console.log(result.error);
   
   
   

   if(result.success){
    return NextResponse.json({
        message:'success',
        status:200,
    })
   }else{
    return NextResponse.json({
        message:'fail',
        status:400,
    })
   }
}