import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgencyCard from "@/components/AgencyCard";
import { Input } from "@/components/ui/input";
import { loadData } from "@/lib/storage";
import { Search } from "lucide-react";

const Agencies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const data = loadData();
  
  const filteredAgencies = data.agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Browse Agencies</h1>
          <p className="text-muted-foreground text-center mb-8">
            Choose from our trusted partner bus operators
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>
        
        {filteredAgencies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No agencies found</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Agencies;
