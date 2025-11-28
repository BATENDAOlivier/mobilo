import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadData, getCurrentUser } from "@/lib/storage";
import { MapPin, Clock, Users, DollarSign } from "lucide-react";

const Booking = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const data = loadData();
  const user = getCurrentUser();
  
  const schedule = data.schedules.find(s => s.id === scheduleId);
  const agency = schedule ? data.agencies.find(a => a.id === schedule.agencyId) : null;
  
  const [seats, setSeats] = useState(1);
  const [passengerName, setPassengerName] = useState(user?.name || "");
  const [passengerPhone, setPassengerPhone] = useState("");

  if (!schedule || !agency) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Schedule not found</h1>
          <Button onClick={() => navigate("/agencies")}>Back to Agencies</Button>
        </div>
      </div>
    );
  }

  const totalPrice = schedule.price * seats;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      scheduleId: schedule.id,
      agencyId: agency.id,
      seats,
      totalPrice,
      passengerName,
      passengerPhone,
      from: schedule.from,
      to: schedule.to,
      date: schedule.date,
      departureTime: schedule.departureTime,
      agencyName: agency.name,
    };
    
    localStorage.setItem('pending_booking', JSON.stringify(bookingData));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProceedToPayment} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seats">Number of Seats</Label>
                      <Input
                        id="seats"
                        type="number"
                        min="1"
                        max={schedule.availableSeats}
                        value={seats}
                        onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        {schedule.availableSeats} seats available
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-accent hover:opacity-90 shadow-button"
                      size="lg"
                    >
                      Proceed to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold mb-2">{agency.name}</div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{schedule.from} → {schedule.to}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{schedule.date} at {schedule.departureTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{seats} seat(s)</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Price per seat</span>
                      <span className="font-medium">{schedule.price} Rwf</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Number of seats</span>
                      <span className="font-medium">{seats}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-2xl text-primary">{totalPrice} Rwf</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
