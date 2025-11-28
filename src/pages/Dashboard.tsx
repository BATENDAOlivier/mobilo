import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { loadData, getCurrentUser } from "@/lib/storage"
import { MapPin, Calendar, Users, DollarSign, Bus } from "lucide-react"

const Dashboard = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const data = loadData()

  useEffect(() => {
    if (!user) {
      navigate("/auth")
    }
  }, [user, navigate])

  if (!user) return null

  const userBookings = data.bookings.filter((b) => b.userId === user.id)
  const totalSpent = userBookings.reduce((sum, b) => sum + b.totalPrice, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and travel history
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold">{userBookings.length}</p>
                </div>
                <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                  <Bus className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold">{totalSpent} Rwf</p>
                </div>
                <div className="bg-gradient-accent w-12 h-12 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Seats
                  </p>
                  <p className="text-3xl font-bold">
                    {userBookings.reduce((sum, b) => sum + b.seats, 0)}
                  </p>
                </div>
                <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Bookings</CardTitle>
              <Button onClick={() => navigate("/agencies")} variant="outline">
                Book New Trip
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userBookings.length > 0 ? (
              <div className="space-y-4">
                {userBookings.map((booking) => {
                  const schedule = data.schedules.find(
                    (s) => s.id === booking.scheduleId
                  )
                  const agency = data.agencies.find(
                    (a) => a.id === booking.agencyId
                  )

                  if (!schedule || !agency) return null

                  return (
                    <div
                      key={booking.id}
                      className="border rounded-lg p-4 hover:shadow-soft transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={agency.logo}
                              className=" w-[100px]"
                              alt=""
                            />
                            <div>
                              <div className="font-semibold">{agency.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Booking ID: {booking.id}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>
                                {schedule.from} → {schedule.to}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{schedule.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span>{booking.seats} seat(s)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-xl font-bold text-primary">
                            {booking.totalPrice} Rwf
                          </div>
                          <Badge
                            variant={
                              booking.paymentStatus === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {booking.paymentStatus}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/track/${booking.id}`)}
                            className="bg-gradient-accent hover:opacity-90"
                          >
                            Track Bus
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Button
                  onClick={() => navigate("/agencies")}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Book Your First Trip
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
