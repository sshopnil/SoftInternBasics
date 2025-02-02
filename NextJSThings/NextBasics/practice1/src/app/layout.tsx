
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            backgroundColor:'lightblue',
            padding: '1rem'
          }}
        >
          Header
        </header>
        {children}
        <footer
          style={{
            backgroundColor: 'aliceblue',
            padding: '1rem'
          }}
        >
          Footer
        </footer>
      </body>
    </html>
  );
}