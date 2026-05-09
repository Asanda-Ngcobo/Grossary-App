



import HomeGrossaryPlus from "@/app/(website)/_components/HomeGrossaryPlus";
import HomeImage from "@/app/(website)/_components/HomeImage";

import PlanningAhead from "@/app/(website)/_components/PlanningAhead";
import ShoppingReimagined from "@/app/(website)/_components/ShoppingReimagined";
import Testimonials from "@/app/(website)/_components/Testimonials";


export const metadata = {
  metadataBase: new URL("https://grossary.shop"),

  title: {
    default:
      "Grossary | Smart Grocery Shopping, Budget Tracking & Price Comparison",
      
    template: "%s | Grossary",
  },

  description:
    "Grossary helps you create grocery lists, track shopping costs in real time, compare prices across South African stores, and stay within budget while shopping.",

  keywords: [
    "Grossary",
    "grocery app",
    "shopping list app",
    "grocery budget tracker",
    "price comparison app",
    "South Africa grocery app",
    "meal planning",
    "student grocery app",
    "real-time grocery total",
    "Shoprite specials",
    "Checkers specials",
    "Pick n Pay specials",
    "Woolworths specials",
    "SPAR specials",
    "Makro specials",
    "grocery savings",
    "budget shopping",
    "shopping planner",
  ],

  applicationName: "Grossary",

  authors: [
    {
      name: "Asanda Ngcobo",
      url: "https://grossary.shop",
    },
  ],

  creator: "Asanda Ngcobo",

  publisher: "Grossary",

  category: "shopping",

  classification: "Grocery Shopping & Budget Tracking App",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "Grossary | Smart Grocery Shopping & Budget Tracking",

    description:
      "Track grocery spending, create shopping lists, compare prices, and shop smarter across South African stores.",

    url: "https://grossary.shop",

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

    title:
      "Grossary | Grocery Shopping Made Smarter",

    description:
      "Create grocery lists, track spending, and compare prices with Grossary.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  other: {
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function Home() {
  return (
    <main className="pt-35">
           <HomeImage/>
   <PlanningAhead/>
   {/* <Finances/> */}
    {/* <HomeGrossaryPlus/> */}
    {/* <BuiltForWho/> */}
   <Testimonials/>
   <ShoppingReimagined/>

    </main>

   
     
 
    
   

     
    
  );
}


 
