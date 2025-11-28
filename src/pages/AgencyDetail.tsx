import { useParams, useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { loadData, getCurrentUser } from "@/lib/storage"
import { Star, Clock, MapPin, Users, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const AgencyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const data = loadData()
  const user = getCurrentUser()

  const agency = data.agencies.find((a) => a.id === id)

  // Filter out past schedules for regular users
  const now = new Date()
  const schedules = data.schedules.filter(
    (s) => s.agencyId === id && new Date(s.date) >= now
  )

  if (!agency) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Agency not found</h1>
          <Button onClick={() => navigate("/agencies")}>
            Back to Agencies
          </Button>
        </div>
      </div>
    )
  }

  const handleBookSchedule = (scheduleId: string) => {
    if (!user) {
      toast.error("Please sign in to book tickets")
      navigate("/auth")
      return
    }
    navigate(`/booking/${scheduleId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <img src={agency.logo} className=" w-[100px]" alt="" />
              <div>
                <h1 className="text-4xl font-bold mb-2">{agency.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-medium">{agency.rating}</span>
                  <span>• {agency.totalTrips} trips completed</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              {agency.description}
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {agency.amenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Available Schedules</h2>
            {schedules.length > 0 ? (
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <Card
                    key={schedule.id}
                    className="hover:shadow-card transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">
                              {schedule.busNumber}
                            </Badge>
                            <Badge variant="secondary">{schedule.date}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {schedule.from}
                              </span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{schedule.to}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>
                                {schedule.departureTime} -{" "}
                                {schedule.arrivalTime}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                              {schedule.availableSeats} of {schedule.totalSeats}{" "}
                              seats available
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-3xl font-bold text-primary">
                            {schedule.price} Rwf
                          </div>
                          <Button
                            onClick={() => handleBookSchedule(schedule.id)}
                            disabled={schedule.availableSeats === 0}
                            className="bg-gradient-accent hover:opacity-90"
                          >
                            {schedule.availableSeats === 0
                              ? "Sold Out"
                              : "Book Now"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No schedules available at the moment
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AgencyDetail
