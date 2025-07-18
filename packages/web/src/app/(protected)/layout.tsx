import { requireSession } from "@/lib/auth-utils";
import { AppSidebar } from "./_components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();

  return (
    <div className="flex size-full">
      <SidebarProvider>
        <AppSidebar user={user} />
        <main className="flex w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
} 