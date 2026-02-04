"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "destructive"
  showPercentage?: boolean
  label?: string
  className?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
  className, 
  value = 0, 
  max = 100, 
  size = "md", 
  variant = "default",
  showPercentage = false,
  label,
  ...props 
}, ref) => {
  const percentage = Math.round((value / max) * 100)
  
  const sizeVariants = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }
  
  const variantStyles = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    destructive: "bg-red-500"
  }

  return (
    <div className="w-full space-y-1">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="text-muted-foreground">{percentage}%</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full bg-secondary w-full",
          sizeVariants[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-300 ease-in-out",
            variantStyles[variant]
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

// Usage Examples:
export const ProgressExamples = () => {
  return (
    <div className="space-y-8 p-6 max-w-md">
      <h2 className="text-2xl font-bold">Progress Component Examples</h2>
      
      {/* Basic Progress */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic Progress</h3>
        <Progress value={60} />
      </div>

      {/* With Label */}
      <div>
        <h3 className="text-lg font-semibold mb-2">With Label</h3>
        <Progress value={75} label="Storage Usage" />
      </div>

      {/* With Percentage */}
      <div>
        <h3 className="text-lg font-semibold mb-2">With Percentage</h3>
        <Progress value={45} showPercentage />
      </div>

      {/* With Label and Percentage */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Label + Percentage</h3>
        <Progress value={85} label="CPU Usage" showPercentage />
      </div>

      {/* Different Sizes */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Different Sizes</h3>
        <div className="space-y-2">
          <Progress value={30} size="sm" label="Small" />
          <Progress value={60} size="md" label="Medium" />
          <Progress value={90} size="lg" label="Large" />
        </div>
      </div>

      {/* Different Variants */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Color Variants</h3>
        <div className="space-y-2">
          <Progress value={70} variant="default" label="Default" showPercentage />
          <Progress value={85} variant="success" label="Success" showPercentage />
          <Progress value={65} variant="warning" label="Warning" showPercentage />
          <Progress value={95} variant="destructive" label="Critical" showPercentage />
        </div>
      </div>

      {/* Custom Max Value */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Custom Max Value</h3>
        <Progress value={250} max={500} label="Custom Scale (250/500)" showPercentage />
      </div>

      {/* Real-world Examples */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Real-world Examples</h3>
        <div className="space-y-3">
          <Progress 
            value={2100} 
            max={2800} 
            label="Storage Used (2.1TB / 2.8TB)" 
            showPercentage 
            variant="warning"
          />
          <Progress 
            value={23} 
            label="CPU Usage" 
            showPercentage 
            variant="success"
            size="sm"
          />
          <Progress 
            value={67} 
            label="Memory Usage" 
            showPercentage 
            variant="default"
          />
        </div>
      </div>
    </div>
  )
}