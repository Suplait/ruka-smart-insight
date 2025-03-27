
import { Bot, FileText, LineChart, Clock, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ValueProposition() {
  const values = [
    {
      icon: Bot,
      title: "Zero Manual Data Entry",
      description: "Forget about entering data manually. Our agents automatically process your documents 24/7."
    },
    {
      icon: FileText,
      title: "Automatic Classification",
      description: "Each document is automatically grouped and classified, keeping your information organized and accessible."
    },
    {
      icon: LineChart,
      title: "Complete Business Overview",
      description: "Access your master data in real-time. Visualize purchases, sales, and margins instantly."
    },
    {
      icon: Clock,
      title: "Reports in Seconds",
      description: "Generate custom reports instantly. What used to take days now takes seconds."
    },
    {
      icon: Users,
      title: "Supplier Integration",
      description: "We connect directly with your suppliers to automatically obtain updated data."
    },
    {
      icon: Zap,
      title: "Ultra-Fast Implementation",
      description: "You'll be operating with Ruka in minutes. The fastest integration in the market."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary/30 to-white" />
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
            Automation That Understands Your Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Specifically designed to solve the daily challenges of medium-sized businesses like yours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className="p-6 bg-white/50 backdrop-blur hover:scale-105 transition-all duration-300 border-primary/10 group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
