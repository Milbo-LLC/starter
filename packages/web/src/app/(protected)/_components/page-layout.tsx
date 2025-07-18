"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageLayoutProps {
  children: React.ReactNode
  showBackButton?: boolean
  backButtonUrl?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  className?: string
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "full": "max-w-full"
}

export function PageLayout({
  children,
  showBackButton = false,
  backButtonUrl,
  maxWidth = "full",
  className
}: PageLayoutProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col w-full p-6">
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          className="mb-6"
          onClick={() => backButtonUrl ? router.push(backButtonUrl) : router.back()}
        >
          <ArrowLeft className="size-5" />
          <span className="sr-only">Back to {backButtonUrl?.replace("/", "")}</span>
        </Button>
      )}
      <div className="flex w-full justify-center">
        <div className={cn(`flex w-full ${maxWidthClasses[maxWidth]}`, className)}>
          {children}
        </div>
      </div>
    </div>
  )
}