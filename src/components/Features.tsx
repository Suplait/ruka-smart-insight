import { CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";

const features = [
  {
    title: "Automated Data Processing",
    description: "No manual data entry needed. Our AI agents handle all the work.",
    icon: CheckCircle,
  },
  {
    title: "Real-time Monitoring",
    description: "Track your operational margins as they happen, not months later.",
    icon: Clock,
  },
  {
    title: "Cost Optimization",
    description: "Identify savings opportunities and optimize your spending.",
    icon: DollarSign,
  },
  {
    title: "Smart Insights",
    description: "Get actionable insights to improve your business performance.",
    icon: TrendingUp,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Ruka.ai</h2>
          <p className="text-xl text-muted-foreground">
            Transform your business operations with intelligent automation
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mb-4 flex justify-center">
                <feature.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}