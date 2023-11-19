"use client";
import Providers from "../Providers";
import Header from "../_components/Header";

export default function RootLayout({ children }) {
  return (
    
      <div style={{ width: "100%" }}>
        <Header />
        <Providers>
        {children}
        </Providers>
      </div>
    
  );
}
