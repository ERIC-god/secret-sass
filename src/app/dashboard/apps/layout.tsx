import React from "react";

export default function AppLayout({children,intercepting}:{children:React.ReactNode,intercepting:React.ReactNode}){
    return(
        <main>
            {children}
            {intercepting}
        </main>
    )
}