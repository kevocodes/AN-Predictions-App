"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CustomTooltipProps {
  description: string
}

export function CustomTooltip({ description }: CustomTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          type="button"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Descripción</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="max-w-xs text-sm">
        {description}
      </PopoverContent>
    </Popover>
  )
}
