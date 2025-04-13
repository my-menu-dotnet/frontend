import Orders from '@/pages/dashboard/orders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/orders')({
  component: Orders,
})
