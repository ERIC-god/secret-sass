import { AppSubNav } from "./AppSubNav";
export default function AppDetailLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
    return (
      <div className="w-full h-full">
        <AppSubNav appId={params.id} />
        <div className="px-8">{children}</div>
      </div>
    );
  }