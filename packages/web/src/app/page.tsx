'use client'

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions("world"));
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data}</div>;
}
