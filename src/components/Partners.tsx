import { Card } from "@/components/ui/card";

export default function Partners() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container">
        <h2 className="text-center text-2xl font-semibold mb-12">
          Trusted by Leading Companies & Partners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 flex items-center justify-center bg-white/50 backdrop-blur">
            <p className="text-xl font-semibold text-muted-foreground">Microsoft</p>
          </Card>
          <Card className="p-6 flex items-center justify-center bg-white/50 backdrop-blur">
            <p className="text-xl font-semibold text-muted-foreground">OpenAI</p>
          </Card>
          <Card className="p-6 flex items-center justify-center bg-white/50 backdrop-blur">
            <p className="text-xl font-semibold text-muted-foreground">500 Global</p>
          </Card>
          <Card className="p-6 flex items-center justify-center bg-white/50 backdrop-blur">
            <p className="text-xl font-semibold text-muted-foreground">100+ Clients</p>
          </Card>
        </div>
      </div>
    </section>
  );
}