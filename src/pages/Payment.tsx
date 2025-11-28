import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addBooking, getCurrentUser } from "@/lib/storage";
import { CreditCard, Smartphone, Lock } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [paymentMethod, setPaymentMethod] = useState<'visa' | 'mobile_money'>('visa');
  const [isProcessing, setIsProcessing] = useState(false);

  const bookingDataStr = localStorage.getItem('pending_booking');
  
  if (!bookingDataStr || !user) {
    navigate('/');
    return null;
  }

  const bookingData = JSON.parse(bookingDataStr);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const booking = addBooking({
        userId: user.id,
        scheduleId: bookingData.scheduleId,
        agencyId: bookingData.agencyId,
        seats: bookingData.seats,
        totalPrice: bookingData.totalPrice,
        paymentMethod,
        paymentStatus: 'completed',
        passengerName: bookingData.passengerName,
        passengerPhone: bookingData.passengerPhone,
        busLocation: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        },
      });

      localStorage.removeItem('pending_booking');
      toast.success("Payment successful! Your booking is confirmed.");
      navigate(`/track/${booking.id}`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Payment</h1>
            <p className="text-muted-foreground">Complete your booking securely</p>
          </div>

          <div className="grid gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agency</span>
                    <span className="font-medium">{bookingData.agencyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route</span>
                    <span className="font-medium">{bookingData.from} → {bookingData.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">{bookingData.date} at {bookingData.departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-medium">{bookingData.seats}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-xl text-primary">{bookingData.totalPrice} Rwf</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="visa" id="visa" />
                      <Label htmlFor="visa" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="mobile_money" id="mobile_money" />
                      <Label htmlFor="mobile_money" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-secondary" />
                        <span>Mobile Money</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'visa' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'mobile_money' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="+1 (555) 123-4567"
                          type="tel"
                          required
                        />
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          You will receive a prompt on your phone to authorize the payment of {bookingData.totalPrice} Rwf
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-accent hover:opacity-90 shadow-button"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing Payment..." : `Pay ${bookingData.totalPrice} Rwf`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
