
import Testimonials from "@/app/(website)/_components/Testimonials";
import SocialAuth from "../../SocialAuth";
import Link from "next/link"


export const metadata = {
  title: "Sign Up to Grossary | Smart Grocery Shopping & Budget Tracking",
  
  description:
    "signup to Grossary to easily manage grocery lists, track shopping costs in real time, compare prices, and plan smarter shopping trips across South African stores.",

  keywords: [
    "Grossary",
    "grocery app",
    "grocery shopping",
    "shopping list app",
    "budget grocery app",
    "South Africa grocery app",
    "price tracking",
    "meal planning",
    "Shoprite",
    "Checkers",
    "Woolworths",
    "Pick n Pay",
    "SPAR",
    "Makro",
    "Clicks",
    "grocery specials",
    "shopping budget tracker",
    "student grocery app",
  ],

  metadataBase: new URL("https://grossary.shop"),

  alternates: {
    canonical: "/signup",
  },

  openGraph: {
    title: "Sign Up to Grossary",
    
    description:
      "Access your grocery lists, shopping budgets, and price tracking tools with Grossary.",

    url: "https://grossary.shop/login",
    
    siteName: "Grossary",

    locale: "en_ZA",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grossary grocery shopping app",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Sign Up to Grossary",

    description:
      "Manage grocery lists, track spending, and shop smarter with Grossary.",

    images: ["/og-image.png"],
  },

  robots: {
    index: false, // usually better for auth pages
    follow: true,

    googleBot: {
      index: false,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  category: "shopping",

  applicationName: "Grossary",

  authors: [
    {
      name: "Asanda Ngcobo",
    },
  ],
};

export default function Page() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
   <Testimonials/>
        <SocialAuth/>
   <section className="text-center text-sm mt-[10vh]">
        <span className="font-semibold">Already have an account? </span>
        <Link href="/login" className="text-[#5358BB] font-semibold underline">
          Login
        </Link>
      </section>
      </div>
  
      
   
  );
}
