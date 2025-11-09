import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { AppStateProvider } from "./lib/useAppState";
import { Analytics } from "@vercel/analytics/next"


export const metadata = {
  title: "Next Earth",
  description: "AI that connects your skills to real climate action.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Analytics />
        </AppStateProvider>
      </body>
    </html>
  );
}