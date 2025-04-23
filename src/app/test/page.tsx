import React from 'react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { db } from '@/server/db/db'
import { Users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export default async function page() {

  // const users=await db.query.Users.findMany();
  const users =  await db.select().from(Users).where(eq(Users.name,'eric'))


  return (
    <div className='dark'>
        <Button className=' dark:absolute dark:h-24' variant='outline' size='sm' asChild>
          <Link href='https://baidu.com'>
            button
          </Link>
        </Button>
        {
          users.map((item)=>(<div className=' absolute top-24' key={item.id}>{item.id}---{item.name}</div>))
        }
        <Alert className='dark:absolute dark:bottom-0'>wow</Alert>
    </div>
  )
}
