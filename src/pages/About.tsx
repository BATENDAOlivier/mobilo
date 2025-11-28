import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About BusTicket</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're revolutionizing bus travel by bringing multiple agencies together on one platform
          </p>
        </div>
      </div>

      <section className="py-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              BusTicket was founded with a simple mission: to make bus travel booking as easy and convenient as possible. We recognized that travelers had to visit multiple websites and physical locations to compare bus schedules and prices across different agencies.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our platform brings together the best bus operators in one place, allowing you to compare, book, and manage your travel with ease. We've integrated real-time tracking, secure payments, and customer support to ensure your journey is smooth from start to finish.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we serve thousands of travelers daily, partnering with trusted agencies to provide reliable, comfortable, and affordable bus travel experiences across the country.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-card">
              <CardContent className="pt-6 text-center">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Customer First</h3>
                <p className="text-sm text-muted-foreground">
                  Your satisfaction and safety are our top priorities
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-card">
              <CardContent className="pt-6 text-center">
                <div className="bg-gradient-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  Working with trusted agencies to serve you better
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-card">
              <CardContent className="pt-6 text-center">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  Committed to delivering the best travel experience
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-card">
              <CardContent className="pt-6 text-center">
                <div className="bg-gradient-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Continuously improving our platform and services
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50+", label: "Partner Agencies" },
              { number: "100K+", label: "Happy Travelers" },
              { number: "500+", label: "Daily Routes" },
              { number: "4.8", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
