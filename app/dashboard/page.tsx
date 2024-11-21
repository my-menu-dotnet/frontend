"use client";

import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"

export default function Page() {
  const {} = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      return await api.get("/company");
    }
  })
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}