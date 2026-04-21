import "../../public/assets/css/styles.css";

export const metadata = {
  title: "Biblia.Creio.EU",
  description: "Plataforma de estudos bíblicos interlineares",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="aurora" aria-hidden="true"></div>
        {children}
      </body>
    </html>
  );
}
