 
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

 

export const metadata = {
  title: "IVUS",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
         
          
          antialiased relative min-h-screen text-white overflow-x-hidden
          bg-gradient-to-br from-[#007c82] via-[#133842] to-[#6d6e71]
        `}
      >
         
        {/* Global Radial Flare */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#007e82]/30 via-transparent to-transparent opacity-40 pointer-events-none -z-10" />

        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>

    </html>
  );
}
