import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import {
  Briefcase,
  Code2,
  GraduationCap,
  Users,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Showcase Projects",
    description:
      "Display your best work with beautiful project cards including descriptions, tech stack, and live links.",
  },
  {
    icon: GraduationCap,
    title: "Education Timeline",
    description:
      "Present your academic journey with an elegant timeline layout that highlights your achievements.",
  },
  {
    icon: Briefcase,
    title: "Work Experience",
    description:
      "Detail your professional experience with company info, roles, and key accomplishments.",
  },
  {
    icon: Globe,
    title: "Public Portfolio URL",
    description:
      "Get your own unique portfolio URL to share with recruiters and on your resume.",
  },
  {
    icon: Zap,
    title: "No Coding Required",
    description:
      "Build your portfolio using simple forms. No technical skills needed to create a stunning page.",
  },
  {
    icon: Users,
    title: "Professional Design",
    description:
      "Clean, modern templates that adapt to any device and make you look professional.",
  },
];

const benefits = [
  "Stand out to recruiters with a professional online presence",
  "Easy to update and maintain your portfolio anytime",
  "Mobile-responsive design that works everywhere",
  "Share your unique URL on resumes and social media",
  "Perfect for students, developers, and professionals",
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-4xl font-bold tracking-tight md:text-6xl"
              data-testid="text-hero-title"
            >
              Build Your Professional Portfolio in{" "}
              <span className="text-primary">Minutes</span>
            </h1>
            <p
              className="mb-8 text-lg text-muted-foreground md:text-xl"
              data-testid="text-hero-subtitle"
            >
              Create a stunning portfolio website without writing a single line of
              code. Showcase your projects, skills, and experience to land your
              dream job.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link href="/dashboard" data-testid="link-hero-dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/register" data-testid="link-hero-register">
                      Create Your Portfolio
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login" data-testid="link-hero-login">
                      Sign In
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl" data-testid="text-features-title">
              Everything You Need to Shine
            </h2>
            <p className="text-lg text-muted-foreground">
              A complete toolkit to create, customize, and share your professional
              portfolio.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover-elevate transition-all duration-200"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold md:text-4xl" data-testid="text-benefits-title">
                  Why Choose PortfolioHub?
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                      data-testid={`text-benefit-${index}`}
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/20" />
                        <div>
                          <div className="mb-1 h-4 w-32 rounded bg-foreground/10" />
                          <div className="h-3 w-24 rounded bg-foreground/5" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-full rounded bg-foreground/10" />
                        <div className="h-3 w-4/5 rounded bg-foreground/5" />
                        <div className="h-3 w-3/4 rounded bg-foreground/5" />
                      </div>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {["React", "TypeScript", "Node.js"].map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-primary/30 px-3 py-1 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl" data-testid="text-cta-title">
              Ready to Build Your Portfolio?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of professionals who have created their portfolios
              with PortfolioHub. It only takes a few minutes to get started.
            </p>
            {!isAuthenticated && (
              <Button size="lg" asChild>
                <Link href="/register" data-testid="link-cta-register">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">PortfolioHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for students, developers, and professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
