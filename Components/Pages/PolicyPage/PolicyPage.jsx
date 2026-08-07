import Footer from "@/Components/UI/Footer/Footer";
import Header from "@/Components/UI/Header/Header";
import LegalHero from "@/Components/UI/Hero/LegalHero";
import HtmlPageTemplate from "@/Components/Pages/HtmlPageTemplate/HtmlPageTemplate/HtmlPageTemplate";

export default function PolicyPage({ pageData, options = {}, description }) {
  return (
    <>
      <Header />
      <main>
        <LegalHero title={pageData.title.rendered} description={description} />
        <HtmlPageTemplate pageData={pageData} />
      </main>
      <Footer
        showFooterCta={false}
        footerCtaData={options.footer_cta}
        socialData={options.social_links}
        heroUspData={options.hero_usp}
      />
    </>
  );
}
