import { requireSession } from "@/lib/auth-utils";
import { PageLayout } from "../_components/page-layout";
import ExampleRequest from "./_components/example-request";

export default async function DashboardPage() {
  await requireSession();
  
  return (
    <PageLayout>
      <ExampleRequest />
    </PageLayout>
  );
}