import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Zap, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ROICalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000000);
  const [materialCosts, setMaterialCosts] = useState(15000000);
  const [laborHours, setLaborHours] = useState(160);
  const [results, setResults] = useState({
    monthlySavings: 0,
    annualSavings: 0,
    roi: 0,
    paybackMonths: 0
  });

  const serviceCost = 1.5 * 35000; // 1.5 UF aproximadamente

  useEffect(() => {
    const materialSavings = materialCosts * 0.03; // 3% savings on materials
    const laborSavings = laborHours * 25000; // $25k per hour saved
    const monthlySavings = materialSavings + laborSavings;
    const annualSavings = monthlySavings * 12;
    const roi = ((annualSavings - (serviceCost * 12)) / (serviceCost * 12)) * 100;
    const paybackMonths = (serviceCost * 12) / monthlySavings;

    setResults({
      monthlySavings,
      annualSavings,
      roi,
      paybackMonths
    });
  }, [monthlyRevenue, materialCosts, laborHours]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const metrics = [
    {
      label: "Ahorro Mensual",
      value: formatCurrency(results.monthlySavings),
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      change: "+3% en materia prima"
    },
    {
      label: "Ahorro Anual",
      value: formatCurrency(results.annualSavings),
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      change: "Sin carga manual"
    },
    {
      label: "ROI",
      value: `${results.roi.toFixed(0)}%`,
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      change: "Retorno garantizado"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/5 to-transparent rounded-full" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Calculator className="w-6 h-6 text-cyan-400" />
            <span className="text-white font-medium">Calculadora ROI Inteligente</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Descubre tu{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Potencial de Ahorro
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Calcula en tiempo real cuánto puedes ahorrar eliminando la carga manual y optimizando tu materia prima
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Calculator Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8">Datos de tu Negocio</h3>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-white/90 font-medium mb-3">Ingresos Mensuales</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="10000000"
                      max="200000000"
                      step="5000000"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-white/70 mt-2">
                      <span>$10M</span>
                      <span className="font-bold text-cyan-400">{formatCurrency(monthlyRevenue)}</span>
                      <span>$200M</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-3">Costo Materia Prima Mensual</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="5000000"
                      max="100000000"
                      step="2500000"
                      value={materialCosts}
                      onChange={(e) => setMaterialCosts(Number(e.target.value))}
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-white/70 mt-2">
                      <span>$5M</span>
                      <span className="font-bold text-cyan-400">{formatCurrency(materialCosts)}</span>
                      <span>$100M</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-3">Horas de Carga Manual Mensual</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="40"
                      max="400"
                      step="20"
                      value={laborHours}
                      onChange={(e) => setLaborHours(Number(e.target.value))}
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-white/70 mt-2">
                      <span>40h</span>
                      <span className="font-bold text-cyan-400">{laborHours}h</span>
                      <span>400h</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <metric.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/70 text-sm font-medium">{metric.label}</p>
                      <p className="text-3xl font-bold text-white">{metric.value}</p>
                      <p className="text-sm text-cyan-400 font-medium">{metric.change}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="pt-6"
            >
              <Card className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-500/30">
                <div className="text-center">
                  <p className="text-white/90 text-lg mb-2">Recuperación de Inversión</p>
                  <p className="text-4xl font-bold text-cyan-400">{results.paybackMonths.toFixed(1)} meses</p>
                  <p className="text-white/70 text-sm mt-2">Inversión: {formatCurrency(serviceCost)} mensual</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="pt-4"
            >
              <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
        }
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </section>
  );
}