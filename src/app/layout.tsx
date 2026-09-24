import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
