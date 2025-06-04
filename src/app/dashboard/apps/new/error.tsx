"use client";
import React from "react";

export default function error({ error }: { error: Error }) {
  return (
    <div>
      <div className=" w-64 mx-auto p-8 flex justify-center items-center flex-col">
        <span>{error.message}</span>
      </div>
    </div>
  );
}
