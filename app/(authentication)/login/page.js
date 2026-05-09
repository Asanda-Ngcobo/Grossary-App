


import LoginAuth from './LoginAuth';

export const metadata = {
  title: "Login to Grossary | Smart Grocery Shopping & Budget Tracking",
  
  description:
    "Log in to Grossary to manage grocery lists, track shopping costs in real time, compare prices, and plan smarter shopping trips across South African stores.",

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
    canonical: "/login",
  },

  openGraph: {
    title: "Login to Grossary",
    
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

    title: "Login to Grossary",

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
export default function SignInForm() {
 

  return (
 
    <div className="w-screen h-screen flex justify-center items-center">
      <LoginAuth/>
    </div>
    
  );
}
