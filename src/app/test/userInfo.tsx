'use client'
import { useSession,SessionProvider as NextAuthProvider} from 'next-auth/react'
import { trpcClient } from "@/utils/client";
import { Uppy } from "@uppy/core";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";

export function UserInfo() {
  const session = useSession();
  const [uppy] = useState(() => {});
  const [number, setNumber] = useState(Math.ceil(Math.random() * 100));
  const [isShow, setIsShow] = useState(false);
  const [guess, SetGuess] = useState(0);
  const handleReset = () => {
    setIsShow(false);
    setNumber(Math.ceil(Math.random() * 100));
  };
  const handleReveal = () => {
    setIsShow(true);
  };
  const handleSubmit = () => {
    if (number > guess) {
      alert("小");
    }
    if (number < guess) {
      alert("大");
    }
    if (number === guess) {
      alert("对");
    }
  };

  // return <div>{session?.data?.user?.name}</div>;
  return (
    <>
      <div className="flex justify-center mt-10 ">
        Number:
        <input
          type="text"
          placeholder="Please Guess"
          onChange={(e) => {
            SetGuess(+e.target.value);
          }}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div className="flex justify-center mt-10">
        <button className="mr-2" onClick={handleReveal}>
          Reveal
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className=" text-[50px] flex justify-center mt-10">
        {isShow && <h1>{number}</h1>}
      </div>
    </>
  );
}

export function SessionProvider(props:any){
    return <NextAuthProvider {...props}></NextAuthProvider>
}