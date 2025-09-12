import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Repository Summaries",
    description:
      "Get AI-powered summaries of any GitHub repository, understanding its purpose, tech stack, and key features at a glance.",
  },
  {
    icon: Zap,
    title: "Cool Facts Discovery",
    description:
      "Uncover interesting statistics, contributor insights, and unique patterns that make each repository special.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
            Powerful Features for Repository Analysis
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Everything you need to understand and track GitHub repositories, from basic insights to advanced analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
