import Auth from '@/pages/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
  component: Auth,
})
