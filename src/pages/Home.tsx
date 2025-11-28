import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AgencyCard from "@/components/AgencyCard"
import { loadData } from "@/lib/storage"
import {
  Bus,
  Shield,
  Clock,
  CreditCard,
  MapPin,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import { useTranslation } from "react-i18next"
const Home = () => {
  const data = loadData()
  const featuredAgencies = data.agencies.slice(0, 3)
  const [api, setApi] = useState<any>()
  const { t } = useTranslation()
  useEffect(() => {
    if (!api) return
  }, [api])

  const carouselBackgrounds = [
    "bg-gradient-to-br from-primary/90 via-secondary/20 to-accent/20",
    "bg-gradient-to-br from-secondary/20 via-accent/20 to-primary/20",
    "bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Carousel Background */}
        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
          className="absolute inset-0"
          setApi={setApi}
        >
          <CarouselContent>
            {["/busPark2.jpg", "/Nyabugogo_Bus_Park.jpg", "/busPark3.jpg"].map(
              (src, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-full">
                    <img
                      src={src}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-right-bottom brightness-75"
                    />
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
        </Carousel>
        <div className=" absolute top-0  w-full h-full bg-blue-700/50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-primary-foreground">
              {t("home.heroTitle")}
              <span className="block  bg-gradient-accent bg-clip-text text-transparent">
                {t("home.heroTitleHighlight")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 ">
              {t("home.heroDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-accent hover:opacity-90 shadow-button text-lg"
              >
                <Link to="/agencies">{t("home.bookNow")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link to="/about">{t("home.learnMore")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience hassle-free travel with our comprehensive booking
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-card">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Bus className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Agencies</h3>
              <p className="text-sm text-muted-foreground">
                Compare and choose from various trusted bus operators
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-card">
            <CardContent className="pt-6">
              <div className="bg-gradient-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Pay safely with mobile money or credit cards
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-card">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track your bus location live on the map
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-card">
            <CardContent className="pt-6">
              <div className="bg-gradient-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Easy Booking</h3>
              <p className="text-sm text-muted-foreground">
                Book your tickets in just a few clicks
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Agencies */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Agencies
            </h2>
            <p className="text-muted-foreground text-lg">
              Travel with the most trusted bus operators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredAgencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/agencies">View All Agencies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Book your bus ticket in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              title: "Choose Agency",
              desc: "Browse and select your preferred bus operator",
            },
            {
              step: "2",
              title: "Pick Schedule",
              desc: "Choose date, time, and available seats",
            },
            {
              step: "3",
              title: "Make Payment",
              desc: "Pay securely with your preferred method",
            },
            {
              step: "4",
              title: "Track & Travel",
              desc: "Track your bus and enjoy the ride",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who trust us for their bus
            ticket bookings
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="shadow-button text-lg"
          >
            <Link to="/agencies">Book Your Ticket Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
