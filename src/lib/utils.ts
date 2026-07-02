import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function calculateProgress(captured: number, approved: number): number {
  if (!approved || approved === 0) return 0
  const percentage = (captured / approved) * 100
  return Math.min(Math.max(percentage, 0), 100)
}
