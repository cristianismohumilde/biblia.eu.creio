import "../../public/assets/css/styles.css";

export const metadata = {
  metadataBase: new URL('https://biblia.creio.eu'),
  title: "Biblia.Creio.EU",
  description: "Plataforma de estudos bíblicos interlineares com análise de manuscritos originais.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Biblia.Creio.EU | Interlinear',
    description: 'Estudo bíblico profundo com transliteração, morfologia e manuscritos originais.',
    url: 'https://biblia.creio.eu',
    siteName: 'Biblia.Creio.EU',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biblia.Creio.EU | Interlinear',
    description: 'Estudo bíblico profundo com transliteração, morfologia e manuscritos originais.',
    images: ['/og-image.png'],
  },
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
