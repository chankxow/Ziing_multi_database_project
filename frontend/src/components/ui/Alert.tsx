import React from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success'
  className?: string
  children: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className,
  children,
  dismissible = false,
  onDismiss
}) => {
  const variants = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  const icons = {
    default: Info,
    destructive: AlertCircle,
    warning: AlertCircle,
    success: CheckCircle
  }

  const Icon = icons[variant]

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        variants[variant],
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="ml-3 flex-1">
          {children}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
