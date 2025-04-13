import Categories from '@/pages/dashboard/categories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/categories')({
  component: Categories,
})
