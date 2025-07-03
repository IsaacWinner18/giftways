"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, AlertCircle } from "lucide-react"

interface CampaignSuccessPageProps {
  campaignUrl: string
}

export function CampaignSuccessPage({ campaignUrl }: CampaignSuccessPageProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Label className="text-sm font-medium text-blue-900 mb-2 block">Your Campaign URL:</Label>
        <div className="flex items-center gap-2">
          <Input value={campaignUrl} readOnly className="bg-white border-blue-200 text-blue-900 font-mono text-sm" />
          <Button
            onClick={() => navigator.clipboard.writeText(campaignUrl)}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-blue-700 mt-2">
          Share this link with your audience so they can participate in your giveaway
        </p>
      </div>

      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Important:</p>
            <p>
              As the creator, you can view your campaign page but cannot participate in your own giveaway. You can
              manage your campaign from the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
