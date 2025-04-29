import { NextRequest, NextResponse } from "next/server";

interface IParmasID{
    params:{
        id:string
    }
}

export function GET(request:NextRequest,{params}:IParmasID){
    
    console.log(params);
    

    return NextResponse.json({
      a:'Hello World'
    })
}

