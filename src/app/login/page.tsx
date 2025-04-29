'use client'

import { useState } from "react"

export default function Page(){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('')
  const handleClick=async ()=>{
    const res=await fetch('http://localhost:3000/api/login',{
      method:'POST',
      body:JSON.stringify({
        username,password
      })
    })
   try{
    const result=await res.json()
    console.log(result);
   }catch{

   }
    
  }
  return <div>
      <form>
          <input type="text" placeholder="username" 
          value={username}  onChange={(e)=>{setUsername(e.target.value)}}/>
          <input type="text" placeholder="password" 
          value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
      </form>
      <button onClick={handleClick}>submit</button>
  </div>
}