

import { getServerSession } from "@/server/auth";
import Detail from "./components/Detail";
import { ISession } from "./components/Detail";


// Mock user data, replace with your real data

export default async function AccountPage() {
  const session = (await getServerSession()) as ISession;
  return <Detail session={session}></Detail>;
}