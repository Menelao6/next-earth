// app/layout.tsx - UPDATED
import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { AppStateProvider } from "./lib/useAppState";

export const metadata = {
  title: "Next Earth",
  description: "AI that connects your skills to real climate action.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppStateProvider>
          <Header />
          <main className="container" style={{ flex: 1 }}>{children}</main>
          <Footer />
        </AppStateProvider>
      </body>
    </html>
  );
}