import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});


export const metadata = {
  title: "Breast Cancer Prediction App",
  description: "An AI-powered application for breast cancer detection and diagnostic report generation.",
  keywords: [
    "Breast Cancer",
    "Cancer Detection",
    "AI Prediction",
    "Medical Diagnosis",
    "Machine Learning",
    "Healthcare",
    "Diagnostic Reports",
  ],
  author: "Alikamatu Osama",
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: "#4F46E5", 
  openGraph: {
    title: "Breast Cancer Prediction App",
    description: "Upload medical images to get AI-powered breast cancer predictions and reports.",
    url: "http://localhost:3000",
    type: "website",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Breast Cancer Prediction App",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${fontOutfit.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
