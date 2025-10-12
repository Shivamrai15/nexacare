import { Clock, Heart, Shield, Star } from "lucide-react"

export const services = [
    {
        title: "Elderly Care",
        description: "Compassionate care for seniors with daily living assistance, companionship, and medical support",
        icon: "/assets/elderly-care-icon.jpg",
        features: [
            "Daily living assistance",
            "Medication management", 
            "Companionship and emotional support",
            "Transportation to appointments",
            "Light housekeeping",
            "Meal preparation"
        ],
        startingPrice: "$25"
    },
    {
        title: "Medical Care",
        description: "Professional medical support and health monitoring by certified healthcare professionals",
        icon: "/assets/medical-care-icon.jpg",
        features: [
            "Vital signs monitoring",
            "Medication administration", 
            "Physical therapy assistance",
            "Post-surgery recovery care",
            "Chronic condition management",
            "Emergency response"
        ],
        startingPrice: "$40"
    }
  ]

export const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Daughter caring for elderly mother",
        rating: 5,
        comment: "Nexacare helped me find the perfect caregiver for my mother. Maria has been with us for 6 months now and the peace of mind is invaluable. My mother loves her and I know she's in safe hands.",
        image: "/assets/placeholder-user.jpg",
        location: "Downtown, ST"
    },
    {
        name: "Michael Chen", 
        role: "Working parent of two",
        rating: 5,
        comment: "Exceptional childcare services! Jennifer has been caring for our twins for over a year. The kids absolutely love her and she's become part of our family. Highly professional and trustworthy.",
        image: "/assets/placeholder-user.jpg",
        location: "Midtown, ST"
    },
    {
        name: "Emily Rodriguez",
        role: "Post-surgery recovery patient", 
        rating: 5,
        comment: "After my knee replacement surgery, Robert provided outstanding medical care at home. His expertise made my recovery so much easier and faster than I expected. Couldn't have asked for better care.",
        image: "/assets/placeholder-user.jpg",
        location: "Uptown, ST"
    }
]

export const features = [
    {
        icon: Star,
        title: "Highly Rated Professionals",
        description: "Connect with top-rated caregivers who have consistently received 4.5+ star reviews from families"
    },
    {
        icon: Clock,
        title: "24/7 Customer Support",
        description: "Round-the-clock support team available to help with any questions or emergency situations"
    },
    {
        icon: Heart,
        title: "Compassionate Care",
        description: "Our caregivers are carefully selected for their genuine compassion and dedication to family wellbeing"
    },
    {
        icon: Shield,
        title: "Background Verified",
        description: "All caregivers undergo comprehensive background checks, reference verification, and credential validation"
    },
]

export const pricingPlans = [
    {
        name: "Basic Care",
        price: "$20-25",
        period: "per hour",
        description: "Perfect for companionship and light assistance",
        features: [
            "Companionship and conversation",
            "Light housekeeping tasks",
            "Meal preparation assistance",
            "Medication reminders",
            "Transportation assistance",
            "Activity engagement"
        ],
        popular: false
    },
    {
        name: "Professional Care", 
        price: "$30-35",
        period: "per hour",
        description: "Comprehensive personal care services",
        features: [
            "All Basic Care features",
            "Personal hygiene assistance",
            "Mobility and transfer help",
            "Medical appointment coordination",
            "24/7 emergency availability",
            "Family communication updates"
        ],
        popular: true
    },
    {
        name: "Specialized Medical Care",
        price: "$40-50", 
        period: "per hour",
        description: "Professional medical care and monitoring",
        features: [
            "All Professional Care features",
            "Medication administration",
            "Vital signs monitoring",
            "Physical therapy assistance",
            "Wound care management",
            "Specialized medical equipment operation"
        ],
        popular: false
    }
  ]

export const allServices = [
    "Elderly Care", "Child Care", "Medical Care", "Disability Support", 
    "Alzheimer's & Dementia Care", "Post-Surgery Recovery", "Companionship", 
    "Housekeeping Services", "Meal Preparation", "Transportation Services", 
    "Pet Care Assistance", "Overnight Care", "Respite Care", "Physical Therapy",
    "Medication Management", "Emergency Care", "Mental Health Support", "Hospice Care"
]

export const faqs = [
    {
        question: "How do you screen and verify your caregivers?",
        answer: "All caregivers undergo a rigorous 7-step screening process including comprehensive background checks, reference verification, skills assessment, drug testing, and credential validation. We also verify certifications, insurance coverage, and conduct in-person interviews to ensure the highest quality of care."
    },
    {
        question: "What if I'm not satisfied with my assigned caregiver?",
        answer: "We offer a 100% satisfaction guarantee. If you're not completely happy with your caregiver for any reason, we'll help you find a replacement within 24 hours at no additional cost. Your comfort and peace of mind are our top priorities."
    },
    {
        question: "Are your caregiving services covered by insurance?",
        answer: "Many insurance plans, including Medicare, Medicaid, and private insurance, cover our services. We work directly with most major insurance providers and can help you understand your coverage options and handle the paperwork to maximize your benefits."
    },
    {
        question: "How quickly can I find and book a caregiver?",
        answer: "Most families are matched with a qualified caregiver within 24-48 hours of their initial request. For urgent or same-day needs, we have emergency caregivers available and can often arrange care within 2-4 hours."
    },
    {
        question: "What are your rates and how does pricing work?",
        answer: "Our rates vary based on the type of care needed, caregiver experience, and location. Rates typically range from $20-50 per hour. We offer transparent pricing with no hidden fees, and you can view exact rates before booking any services."
    },
    {
        question: "Do you provide care in my specific area?",
        answer: "We serve most major metropolitan areas and surrounding suburbs. Enter your zip code on our search page to see available caregivers in your area. We're constantly expanding our network to serve more communities."
    }
]


export const CURRENCIES = [
    { value: "INR", label: "₹ INR", symbol: "₹" },
    { value: "USD", label: "$ USD", symbol: "$" },
    { value: "EUR", label: "€ EUR", symbol: "€" },
    { value: "GBP", label: "£ GBP", symbol: "£" },
];
