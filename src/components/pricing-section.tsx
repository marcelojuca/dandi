import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with repository analysis",
    features: ["5 repository analyses per month", "Basic insights and summaries", "Star tracking", "Community support"],
    cta: "Get Started Free",
    popular: true,
    comingSoon: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For developers and teams who need more insights",
    features: [
      "100 repository analyses per month",
      "Advanced analytics and cool facts",
      "PR and version tracking",
      "Export reports",
      "Priority support",
      "API access",
    ],
    cta: "Start Pro Trial",
    popular: false,
    comingSoon: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For organizations with extensive analysis needs",
    features: [
      "Unlimited repository analyses",
      "Custom integrations",
      "Team collaboration features",
      "Advanced security insights",
      "Dedicated support",
      "Custom reporting",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
    comingSoon: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-card border-border ${
                plan.popular ? "ring-2 ring-primary shadow-lg scale-105" : ""
              } ${plan.comingSoon ? "opacity-75" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.comingSoon && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-card-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-card-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  disabled={plan.comingSoon}
                >
                  {plan.comingSoon ? "Coming Soon" : plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
