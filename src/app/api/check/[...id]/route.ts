import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


interface IParmasID{
    params:{
        id:string
    }
}


export function GET(request:NextRequest,{params}:IParmasID){
    const query = request.nextUrl.searchParams.get('a')
    console.log(query);
  
    
    
    const {id}=params
    return NextResponse.json({
        id
    })
}
