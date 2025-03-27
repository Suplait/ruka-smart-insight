
import { Bot, Brain, Clock, LineChart } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: Bot,
      title: "24/7 Autonomous Agents",
      description: "Automate repetitive tasks while reducing operating costs and human errors"
    },
    {
      icon: Brain,
      title: "AI That Learns From Your Business",
      description: "Our agents adapt to your processes to deliver more accurate insights every day"
    },
    {
      icon: Clock,
      title: "Instant Information",
      description: "Access your data in real time to make informed decisions when you need them"
    },
    {
      icon: LineChart,
      title: "Total Control",
      description: "Visualize and optimize your operating margin with up-to-date data and detailed reports"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary/30 to-white" />
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Intelligent Agents Working for You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Imagine having a team that works 24/7 recording purchases, grouping master supplies, monitoring prices, alerting anomalies, and detecting opportunities.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Digitize and Clean", desc: "Reduce to 0 the time to record your purchases", imgSrc: "/value1.png" },
            { title: "Group and Classify", desc: "Automatically create a master inventory", imgSrc: "/value2.png" },
            { title: "Monitor 24/7", desc: "Immediate alert for anomalies that affect your margin", imgSrc: "/value3.png" }
          ].map((agent, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden bg-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-video">
                <img 
                  src={agent.imgSrc} 
                  alt={agent.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">{agent.title}</h4>
                  <p className="text-sm opacity-90">{agent.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="my-16"></div> {/* Added space between the two sections */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/50 backdrop-blur hover:scale-105 transition-all duration-300 border-primary/10 group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
