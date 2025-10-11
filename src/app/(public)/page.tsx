import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { allServices, faqs, features, pricingPlans, services, testimonials } from "@/lib/constant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const Page = () => {
    return (
        <main className="bg-background container">
            <div className="min-h-screen w-full bg-[url('/assets/2151224179.jpg')] bg-cover bg-center">  
                <div className="bg-black/50 pt-10">
                    <div className="relative z-20 container mx-auto text-center max-w-7xl px-6">
                        <div className="mb-8">
                            <Badge className="bg-white/90 text-primary border-white/50 text-sm px-4 py-2 mb-8 backdrop-blur-sm">
                            🏆 Trusted by 5,000+ families nationwide
                            </Badge>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight text-white drop-shadow-2xl">
                            Care that feels
                            <br />
                            <span className="text-blue-200">like family</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                            Connect with compassionate, verified caregivers who provide personalized care 
                            for your loved ones. Professional. Trusted. <span className="font-semibold text-blue-300">Always there.</span>
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <Link href="/search">
                            <Button size="lg" className="text-white px-12 py-6 text-lg rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                                Find Your Caregiver
                                <ArrowRight className="ml-3 h-6 w-6" />
                            </Button>
                            </Link>
                            <Link href="/sign-up">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white/50 text-white hover:bg-white/20 hover:text-white px-12 py-6 text-lg rounded-full backdrop-blur-sm bg-white/10 transition-all duration-300"
                            >
                                Become a Caregiver
                            </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pb-20 px-6">
                        <div className="group p-8 rounded-3xl bg-white/15 backdrop-blur-lg border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all duration-500">
                            <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                                1,000+
                            </div>
                            <div className="text-white/90 font-medium">Verified Caregivers</div>
                            <div className="text-sm text-white/70 mt-1">Background checked & certified</div>
                        </div>
                        <div className="group p-8 rounded-3xl bg-white/15 backdrop-blur-lg border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all duration-500">
                            <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                                5,000+
                            </div>
                            <div className="text-white/90 font-medium">Happy Families</div>
                            <div className="text-sm text-white/70 mt-1">Across all 50 states</div>
                        </div>
                        <div className="group p-8 rounded-3xl bg-white/15 backdrop-blur-lg border border-white/20 hover:bg-white/25 hover:shadow-2xl transition-all duration-500">
                            <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                                4.9★
                            </div>
                            <div className="text-white/90 font-medium">Average Rating</div>
                            <div className="text-sm text-white/70 mt-1">From verified reviews</div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-foreground mb-4">Comprehensive Care Services</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Professional care services tailored to meet your family&apos;s unique needs with certified, compassionate caregivers
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {services.map((service, index) => (
                        <Card key={index} className="bg-card border-border hover:shadow-xl transition-all duration-300 group">
                            <CardHeader className="text-center pb-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                                <div className="w-14 h-14 rounded-lg overflow-hidden relative">
                                    <Image 
                                        src={service.icon} 
                                        alt={service.title}
                                        fill
                                        className="w-14 h-14 object-cover"
                                    />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-card-foreground mb-2">{service.title}</CardTitle>
                            <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                            <div className="mt-4">
                                <span className="text-2xl font-bold text-primary">
                                {service.startingPrice}
                                </span>
                                <span className="text-muted-foreground">/hour starting</span>
                            </div>
                            </CardHeader>
                            <CardContent>
                            <ul className="space-y-3">
                                {service.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start text-sm text-muted-foreground">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                    {feature}
                                </li>
                                ))}
                            </ul>
                            <Button className="w-full mt-6" variant="outline">
                                Learn More
                            </Button>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]"></div>
                <div className="container mx-auto max-w-7xl relative">
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-sky-600 via-primary to-blue-600 bg-clip-text text-transparent mb-6">
                    Why Families Choose Nexacare
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    We&apos;re committed to providing the highest quality care services with complete transparency and peace of mind
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                        <div key={index} className="group relative">
                        <div className="relative h-full overflow-hidden p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 hover:bg-white/80 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <IconComponent className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {feature.description}
                            </p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        </div>
                    )
                    })}
                </div>
                </div>
            </section>
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-foreground mb-4">What Our Families Say</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Real stories from families who found their perfect caregivers through Nexacare
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                            <AvatarFallback className="text-lg">{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg text-card-foreground">{testimonial.name}</h4>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{testimonial.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground italic leading-relaxed">&quot;{testimonial.comment}&quot;</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-foreground mb-4">Transparent, Fair Pricing</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Choose the care level that perfectly fits your needs and budget. No hidden fees, no surprises.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <Card key={index} className={`bg-card border-border relative hover:shadow-xl transition-all duration-300 ${plan.popular ? 'border-primary scale-105' : ''}`}>
                                {plan.popular && (
                                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm">
                                        Most Popular
                                    </Badge>
                                )}
                                <CardHeader className="text-center pb-8">
                                    <CardTitle className="text-2xl text-card-foreground">{plan.name}</CardTitle>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground">/{plan.period}</span>
                                    </div>
                                    <CardDescription className="mt-2 text-base">{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-muted-foreground">{feature}</span>
                                        </li>
                                        ))}
                                    </ul>
                                    <Button 
                                        className="w-full" 
                                        variant={plan.popular ? "default" : "outline"}
                                        size="lg"
                                    >
                                        Get Started
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 bg-card border-y border-border overflow-hidden">
                <div className="container mx-auto text-center mb-8 max-w-7xl">
                    <h2 className="text-3xl font-bold text-card-foreground mb-3">Complete Range of Care Services</h2>
                    <p className="text-muted-foreground text-lg">Professional caregivers available for every type of care need</p>
                </div>
                
                <div className="relative">
                    <div className="flex space-x-6 animate-marquee">
                        {[...allServices, ...allServices].map((service, index) => (
                        <div key={index} className="flex-shrink-0">
                            <Badge 
                                variant="secondary" 
                                className="text-sm px-6 py-3 bg-muted text-foreground whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                {service}
                                </Badge>
                        </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-muted-foreground">
                            Get answers to the most common questions about our caregiving services
                        </p>
                    </div>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                                <AccordionTrigger className="text-left text-foreground hover:text-primary text-lg font-medium py-6 md:cursor-pointer ">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

        </main>
    )
}

export default Page;
