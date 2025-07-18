"use client"

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function ExampleRequest() {  
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions());
  
  if (!greeting.data) return <div>Loading...</div>

  return <div>{greeting.data}</div>
} 