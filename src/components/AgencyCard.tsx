import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"
import { Agency } from "@/lib/storage"

interface AgencyCardProps {
  agency: Agency
}

const AgencyCard = ({ agency }: AgencyCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-card transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={agency.logo} className=" w-[100px]" alt="" />

            <div>
              <h3 className="font-semibold text-lg">{agency.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{agency.rating}</span>
                <span>({agency.totalTrips} trips)</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {agency.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {agency.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-gradient-primary hover:opacity-90">
          <Link to={`/agency/${agency.id}`}>
            <MapPin className="mr-2 h-4 w-4" />
            View Schedules
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AgencyCard
