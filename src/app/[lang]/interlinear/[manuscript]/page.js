import InterlinearClient from "@/app/components/InterlinearClient";

export async function generateStaticParams() {
  const langs = ["pt", "en"];
  const manuscripts = [
    "b19a", "aleppo", "qumran", "lxx", "byzantine", 
    "targum", "vulgate", "syriac", "geez", "coptic", "armenian"
  ];
  
  const params = [];
  for (const lang of langs) {
    for (const ms of manuscripts) {
      params.push({ lang, manuscript: ms });
    }
  }
  return params;
}

export default async function InterlinearManuscriptPage({ params }) {
  const { lang, manuscript } = await params;
  
  // The verse will be handled by the client component via search params
  // or passed down from the home page selection.
  return (
    <InterlinearClient 
      lang={lang} 
      manuscript={manuscript} 
    />
  );
}
