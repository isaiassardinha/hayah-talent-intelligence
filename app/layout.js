import "./globals.css";

export const metadata = {
  title: "Hayah Talent Intelligence",
  description: "Perfil, compatibilidade e alocação de talentos. Protótipo para uso pessoal e testes."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
