import type { ReactNode } from "react";

export const metadata = {
  title: "DataDemolisher",
  description: "FRC scouting and strategy platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, Arial, sans-serif", background: "#0b1220", color: "#e5e7eb" }}>
        {children}
      </body>
    </html>
  );
}
