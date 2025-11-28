import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadData } from "@/lib/storage";
import { MapPin, Clock, User, Phone, CheckCircle } from "lucide-react";

const TrackBus = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const data = loadData();
  
  const booking = data.bookings.find(b => b.id === bookingId);
  const schedule = booking ? data.schedules.find(s => s.id === booking.scheduleId) : null;
  const agency = booking ? data.agencies.find(a => a.id === booking.agencyId) : null;

  if (!booking || !schedule || !agency) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Track your bus in real-time</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Live Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Simulated Map */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                    <div className="relative z-10 text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-2 animate-bounce" />
                      <p className="text-sm text-muted-foreground">
                        Bus Location: {booking.busLocation ? 
                          `${booking.busLocation.lat.toFixed(4)}, ${booking.busLocation.lng.toFixed(4)}` : 
                          'Updating...'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Map integration available with Mapbox
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trip Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary rounded-full p-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">Booking Confirmed</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(booking.bookingDate).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-muted rounded-full p-2 mt-1">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Departure</div>
                        <div className="text-sm text-muted-foreground">
                          {schedule.date} at {schedule.departureTime} from {schedule.from}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-muted rounded-full p-2 mt-1">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Expected Arrival</div>
                        <div className="text-sm text-muted-foreground">
                          {schedule.date} at {schedule.arrivalTime} in {schedule.to}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Booking ID</div>
                    <div className="font-mono text-sm">{booking.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Agency</div>
                    <div className="font-medium">{agency.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Bus Number</div>
                    <div className="font-medium">{schedule.busNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Route</div>
                    <div className="font-medium">{schedule.from} → {schedule.to}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Seats</div>
                    <div className="font-medium">{booking.seats}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Paid</div>
                    <div className="font-bold text-lg text-primary">{booking.totalPrice} Rwf</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Passenger Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.passengerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.passengerPhone}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => navigate("/dashboard")} variant="outline" size="lg">
              View All Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackBus;
