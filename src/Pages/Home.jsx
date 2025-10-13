import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Clock, 
  Shield, 
  Smartphone, 
  TrendingDown, 
  CheckCircle,
  ArrowRight,
  ParkingCircle,
  Zap,
  Users,
  DollarSign,
  Building2,
  Car
} from "lucide-react";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      // Not logged in
    }
    setIsLoading(false);
  };

  const handleGetStarted = async (userType) => {
    if (currentUser) {
      if (currentUser.user_type === "driver") {
        window.location.href = createPageUrl("FindParking");
      } else {
        window.location.href = createPageUrl("OperatorDashboard");
      }
    } else {
      // Redirect to registration with user type
      window.location.href = createPageUrl("Register") + `?type=${userType}`;
    }
  };

  const driverFeatures = [
    {
      icon: MapPin,
      title: "Find Parking Instantly",
      description: "Search and book verified parking spots in seconds across Lagos"
    },
    {
      icon: Clock,
      title: "Save Time & Money",
      description: "No more circling blocks wasting fuel. Book ahead and drive straight in"
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "All locations verified with CCTV, security guards, and safe access"
    },
    {
      icon: Smartphone,
      title: "Mobile Payment",
      description: "Pay seamlessly with cards, transfers, or wallet. All transactions tracked"
    }
  ];

  const ownerFeatures = [
    {
      icon: DollarSign,
      title: "Generate Revenue",
      description: "Turn your empty parking space into a steady income stream"
    },
    {
      icon: Users,
      title: "Reach More Customers",
      description: "Access thousands of drivers actively searching for parking"
    },
    {
      icon: TrendingDown,
      title: "Track Performance",
      description: "Real-time analytics on bookings, revenue, and occupancy rates"
    },
    {
      icon: Building2,
      title: "Easy Management",
      description: "Digital dashboard to manage all your spaces from one place"
    }
  ];

  const stats = [
    { value: "2.5M+", label: "Daily Vehicles", icon: Car },
    { value: "30 min", label: "Avg. Time Saved", icon: Clock },
    { value: "500+", label: "Parking Locations", icon: MapPin },
    { value: "₦456B", label: "Market Size", icon: DollarSign }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Zap className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">Solving Lagos parking one spot at a time</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Smart Parking for{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Everyone in Lagos
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
              Whether you're looking for parking or have space to rent out, E-Parking connects drivers with secure parking spots across Lagos
            </p>
            
            <div className="flex items-center gap-6 pt-4 justify-center flex-wrap">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-emerald-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two User Types Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join as a driver looking for parking or as a parking lot owner looking to earn
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Driver Card */}
            <Card className="border-none shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 bg-gradient-to-br from-white to-emerald-50/30">
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-emerald-200">
                  <Car className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">I'm a Driver</h3>
                <p className="text-lg text-gray-600 mb-8">
                  Find and book secure parking spaces across Lagos in seconds. Save time, reduce stress.
                </p>

                <div className="space-y-4 mb-8">
                  {driverFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg"
                  onClick={() => handleGetStarted("driver")}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-lg py-6 rounded-xl shadow-lg shadow-emerald-200 group"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : currentUser ? "Find Parking Now" : "Register as Driver"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Parking Owner Card */}
            <Card className="border-none shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 bg-gradient-to-br from-white to-amber-50/30">
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-amber-200">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">I Own Parking Space</h3>
                <p className="text-lg text-gray-600 mb-8">
                  List your parking lot and start earning. Reach thousands of drivers daily.
                </p>

                <div className="space-y-4 mb-8">
                  {ownerFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg"
                  onClick={() => handleGetStarted("operator")}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-lg py-6 rounded-xl shadow-lg shadow-amber-200 group"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : currentUser?.user_type === "operator" ? "Go to Dashboard" : "List Your Parking Space"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How E-Parking Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* For Drivers */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-emerald-700" />
                </div>
                For Drivers
              </h3>
              
              <div className="space-y-4">
                {[
                  { step: "1", title: "Search", desc: "Find available parking near your destination" },
                  { step: "2", title: "Book", desc: "Reserve your spot in seconds with instant confirmation" },
                  { step: "3", title: "Pay", desc: "Secure digital payment - card, transfer, or wallet" },
                  { step: "4", title: "Park", desc: "Drive in with your booking code. No hassle, no stress" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Owners */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-amber-700" />
                </div>
                For Parking Owners
              </h3>
              
              <div className="space-y-4">
                {[
                  { step: "1", title: "List", desc: "Add your parking space with photos and details" },
                  { step: "2", title: "Set Price", desc: "Choose your hourly rate and available amenities" },
                  { step: "3", title: "Get Bookings", desc: "Drivers discover and book your space automatically" },
                  { step: "4", title: "Earn", desc: "Receive payments directly. Track everything in your dashboard" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            Join thousands of drivers and parking owners already using E-Parking
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => handleGetStarted("driver")}
              className="bg-white text-emerald-900 hover:bg-amber-50 text-xl px-10 py-7 rounded-2xl shadow-2xl font-bold group"
              disabled={isLoading}
            >
              Find Parking
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>

            <Button 
              size="lg"
              onClick={() => handleGetStarted("operator")}
              className="bg-amber-500 text-white hover:bg-amber-600 text-xl px-10 py-7 rounded-2xl shadow-2xl font-bold group"
              disabled={isLoading}
            >
              List Your Space
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>

          <p className="text-emerald-200 mt-6">
            Free to join • No hidden fees • Start earning or parking today
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center">
                <ParkingCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white">E-Parking</div>
                <div className="text-xs">Lagos Smart Parking</div>
              </div>
            </div>
            
            <div className="text-sm text-center md:text-left">
              <p>© 2024 E-Parking Lagos. Solving parking one spot at a time.</p>
              <p className="mt-1">Powered by AI • Built for Lagos • Trusted by thousands</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}