import { Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export const Footer = () => {
    return (
        <footer className="bg-primary text-primary-foreground py-16 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 relative rounded-xl flex items-center justify-center">
                                <Image
                                    src="/assets/logo.png"
                                    alt="NexaCare"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                            <span className="text-2xl font-bold">Nexacare</span>
                        </div>
                        <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                            Connecting families with trusted, professional caregivers for comprehensive care services. 
                            Your family&apos;s wellbeing is our mission.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>1-800-CARE-NOW (1-800-227-3669)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>support@nexacare.com</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Our Services</h4>
                        <ul className="space-y-3 text-primary-foreground/80">
                            <li><Link href="/search" className="hover:text-primary-foreground transition-colors">Find Caregivers</Link></li>
                            <li><Link href="/register" className="hover:text-primary-foreground transition-colors">Become a Caregiver</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Elderly Care</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Child Care</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Medical Care</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Specialized Care</Link></li>
                        </ul>
                    </div>
                    
                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Support & Resources</h4>
                        <ul className="space-y-3 text-primary-foreground/80">
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Safety & Security</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Insurance Information</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Care Resources</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Contact Support</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Emergency Assistance</Link></li>
                        </ul>
                    </div>
                    
                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Company</h4>
                        <ul className="space-y-3 text-primary-foreground/80">
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">How It Works</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Press & Media</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Partner With Us</Link></li>
                            <li><Link href="#" className="hover:text-primary-foreground transition-colors">Investor Relations</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-primary-foreground/20 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-primary-foreground/80 text-sm">
                            © 2025 Nexacare, Inc. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm text-primary-foreground/80">
                            <Link href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
                            <Link href="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</Link>
                            <Link href="#" className="hover:text-primary-foreground transition-colors">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
