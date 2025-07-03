import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface Campaign {
  id: string
  title: string
  status: string
  totalAmount: number
  currentParticipants: number
  maxParticipants: number
  amountPerPerson: number
  createdAt: string
  platform: string
  handle: string
}

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border-purple-100 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-purple-900">{campaign.title}</CardTitle>
            <CardDescription>Created on {new Date(campaign.createdAt).toLocaleDateString()}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/campaign/${campaign.id}`}>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-900">₦{campaign.totalAmount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Total Amount</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-900">
              {campaign.currentParticipants}/{campaign.maxParticipants}
            </div>
            <div className="text-xs text-gray-600">Participants</div>
          </div>
        </div>

        <div className="space-y-2">{/* Additional content can be added here */}</div>
      </CardContent>
    </Card>
  )
}
