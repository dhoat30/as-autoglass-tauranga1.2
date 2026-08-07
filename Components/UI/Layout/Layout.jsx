import RowSection from "./Sections/RowSection/RowSection";
import ServicesSection from "./Sections/ServicesSection/ServicesSection";
import FaqAccordionSection from "./Sections/FaqAccordionSection/FaqAccordionSection";
import FormSection from "./Sections/FormSection/FormSection";
import FormHeroSection from "./Sections/FormHeroSection/FormHeroSection";
import RegularProcess from "./Sections/Process/RegularProcess";
import USP from "../USP/USP";
import Stats from "../Stats/Stats";
import LocationsCovered from "../LocationsCovered/LocationsCovered";
import HoursCalculator from "./Sections/HoursCalculator/HoursCalculator";
import ContactSection from "./Sections/ContactSection/ContactSection";
import SpaceCalculator from "./Sections/SpaceCalculator/SpaceCalculator";
import FooterCta from "../CTA/FooterCta";
import GoogleReviewsCarousel from "../GoogleReviews/GoogleReviewsCarousel";
import UspTable from "./Sections/UspTable/UspTable";
import CardsSection from "./Sections/CardsSection/CardsSection";
import TabsSection from "./Sections/TabsSection/TabsSection";
import MovingCardFormSection from "./Sections/MovingCardFormSection/MovingCardFormSection";
import ClientOnlyJobsMap from "./Sections/JobsMap/ClientOnlyJobsMap";
import LandingPageHeroSection from "./Sections/LandingPageHeroSection/LandingPageHeroSection";
import HeroSection from "./Sections/HeroSection/HeroSection";
import ServiceCardsTwoColumn from "./Sections/ServiceCardsTwoColumn/ServiceCardsTwoColumn";
import UspAccordionSection from "./Sections/UspAccordionSection/UspAccordionSection";
import DuctCleaningSection from "./Sections/DuctCleaningSection/DuctCleaningSection";
import ClientLogosSection from "./Sections/ClientLogosSection/ClientLogosSection";
import ProblemSection from "./Sections/ProblemSection/ProblemSection";
import ServicesAccordionSection from "./Sections/ServicesAccordionSection/ServicesAccordionSection";
import VideoSection from "./Sections/VideoSection/VideoSection";
import InsuranceSection from "./Sections/InsuranceSection/InsuranceSection";
import GuaranteeSection from "./Sections/GuaranteeSection/GuaranteeSection";
import GallerySection from "../Gallery/GallerySection";
import { TAURANGA_SERVICE_LOCATIONS } from "@/utils/staticData/taurangaServiceLocations";

const DEFAULT_TAURANGA_LOCATIONS_CONTENT = {
  title: "Mobile Windscreen Services Across Tauranga",
  description:
    "We provide mobile windscreen replacement and repair services throughout Tauranga and the Western Bay of Plenty—from Ōmokoroa and Te Puna, through the city, Mount Maunganui and Pāpāmoa, to Te Puke. We can come to your home or workplace anywhere across our service area.",
  locations: TAURANGA_SERVICE_LOCATIONS,
};
export default function Layout({
  uspTable,
  sections,
  ductCleaning,
  clientLogos,
  uspData,
  statsData,
  locationsCovered,
  hoursCalculatorData,
  spaceCalculatorData,
  contactInfo,
  socialData,
  servicesData,
  googleReviewsData,
  reviewerPics,
  routeId,
  serviceJobs,
  galleryData,
}) {
console.log(sections)
  if (!sections) return null;
  const sectionsJSX = sections.map((section, index) => {
    if (section.acf_fc_layout === "moving_card_form_section") {
      return (
        <MovingCardFormSection
          key={index}
          title={section.title}
          description={section.description}
          usp={{
            text_usp: section.usp.text_usp,
            image_usp: section.usp.image_usp,
          }}
          graphic={section.graphic}
          routeId={routeId}
        />
      );
    }
  
    if (section.acf_fc_layout === "tabs_section") {
      return (
        <TabsSection
          key={index}
          title={section.title}
          description={section.description}
          cards={section.cards}
        />
      );
    }
    if (section.acf_fc_layout === "row") {
      let remappedAccordion;
      if (section.accordion) {
        remappedAccordion = section?.accordion?.map(({ title, value }) => ({
          question: title,
          answer: value,
        }));
      }

      return (
        <RowSection
          key={index}
          eyebrowText={section.eyebrow_text}
          subtitle={section.subtitle}
          title={section.title}
          description={section.description}
          imageAlignment={section.image_alignment}
          image={section.image}
          cta={section.cta}
          items={section.items}
          accordionData={remappedAccordion}
          showBeforeAfterImages={section.show_before_after_images}
          backgroundColor={section.background_color}
          fontColor={section.font_color}
          beforeImage={
            section.show_before_after_images &&
            section.before_after_images.before_image
          }
          afterImage={
            section.show_before_after_images &&
            section.before_after_images.after_image
          }
        />
      );
    }
    if (section.acf_fc_layout === "services") {
      return (
        <ServicesSection
          key={index}
          eyebrowText={section.eyebrow_text}
          
          title={section.title}
          subtitle={section.subtitle}
          description={section.description}
          cards={section.cards}
        />
      );
    }
    if (section.acf_fc_layout === "services_accordion") {
      return (
        <ServicesAccordionSection
          key={index}
          eyebrowText={section.eyebrow_text}
          title={section.title}
          description={section.description}
          cards={section.cards}
        />
      );
    }
    if (section.acf_fc_layout === "problem_section") {
      return (
        <ProblemSection
          key={index}
          eyebrowText={section.eyebrow_text}
          title={section.title}
          description={section.description}
          subtitle={section.subtitle}
          cta={section.cta}
          problemList={section.problem_list}
        />
      );
    }
    if (section.acf_fc_layout === "insurance_section") {
      return (
        <InsuranceSection
          key={section.id ?? `insurance-${index}`}
          eyebrowText={section.eyebrow_text}
          title={section.title}
          description={section.description}
          cta={section.cta}
          ctaNote={section.cta_note}
          steps={section.steps}
        />
      );
    }
    if (section.acf_fc_layout === "guarantee_section") {
      return (
        <GuaranteeSection
          key={section.id ?? `guarantee-${index}`}
          eyebrowText={section.eyebrow_text}
          title={section.title}
          description={section.description}
          cta={section.cta}
          badge={section.badge}
        />
      );
    }
    if (section.acf_fc_layout === "show_client_logos") {
      return <ClientLogosSection key={index} logos={clientLogos} />;
    }
    if (section.acf_fc_layout === "cards_section") {
      return (
        <CardsSection
          key={index}
          title={section.section_title}
          description={section.section_description}
          cards={section.cards}
        />
      );
    }
    if (section.acf_fc_layout === "process") {
      return (
        <RegularProcess
          key={index}
          title={section.title}
          description={section.description}
          cards={section.cards}
          image={section.image}
        />
      );
    }

    // if (section.acf_fc_layout === "tabs_section") {
    //   return    <GradientTabs   key={index}
    //   title={section.section_title}
    //   description={section.section_description}
    //   cards={section.tabs}/>
    // }

    // if (section.acf_fc_layout === "packages") {
    //   return (
    //     <Packages
    //       key={index}
    //       serviceName={section.service_name}
    //       title={section.title}
    //       packagesArray={section.package}
    //       termsAndConditions={section.terms_conditions}
    //     />
    //   );
    // }
    if (section.acf_fc_layout === "local_faq") {
      return (
        <FaqAccordionSection
          key={index}
          title={section.section_title}
          description={section.section_description}
          eyebrowText={section.eyebrow_text}
          qaData={section.items}
        />
      );
    }

    if (section.acf_fc_layout === "form_section") {
      return (
        <FormSection
          key={index}
          title={section.title}
          description={section.description}
          usp={{ text_usp: section.text_usp, image_usp: section.image_usp }}
          graphic={section.graphic}
          reviewerPics={reviewerPics}
        />
      );
    }

    if (section.acf_fc_layout === "form_hero_section") {
      let graphicData;
      if (section.graphic_type === "new_graphic_type") {
        graphicData = section.new_graphic_type;
      }
      if (section.graphic_type === "image") {
        graphicData = section.image;
      }
      if (section.graphic_type === "youtube_video") {
        graphicData = section.youtube_video_group;
      }
      return (
        <FormHeroSection
          key={index}
          title={section.title}
          subtitle={section.subtitle}
          description={section.description}
          cta={section.cta}
          graphicType={section.graphic_type}
          graphicData={graphicData}
          uspData={section.usp}
          reviewTitle={section.review_title}
          reviewerPics={reviewerPics}
        />
      );
    }
if (section.acf_fc_layout === "landing_page_hero_section"  ) {
      return (
        <LandingPageHeroSection key={index}
        aboveTitleUsp={section.above_title_usp}
          trustSnippet={section.trust_snippet}
          title={section.title}
          subtitle={section.subtitle}
          description={section.description}
          cta={section.cta}
        
          uspData={section.usp}
          reviewTitle={section.review_title}
          reviewerPics={reviewerPics}/> 
     
      );
    }
    if(section.acf_fc_layout === "hero_section") { 
      let graphicData;
      if (section.graphic_type === "new_graphic_type") {
        graphicData = section.new_graphic_type;
      }
      if (section.graphic_type === "image") {
        graphicData = section.image;
      }
      if (section.graphic_type === "youtube_video") {
        graphicData = section.youtube_video_group;
      }
      if (section.graphic_type === "video") {
        graphicData = section.video_group;
      }
      return (
        <HeroSection key={index}
                  subtitle={section.subtitle}
        title={section.title}
          description={section.description}
          cta={section.cta}
           graphicType={section.graphic_type}
          graphicData={graphicData}
          uspData={section.usp}
         
          /> 
     
      );
    }
    if (section.acf_fc_layout === "video_section") {
      return (
        <VideoSection
          key={section.id ?? `video-${index}`}
          title={section.title}
          videoId={section.youtube_video_id}
          placeholderImage={section.placeholder_image}
          eyebrow={section.eyebrow_text}
        />
      );
    }
    if (section.acf_fc_layout === "show_gallery") {
      if (!Array.isArray(galleryData) || galleryData.length === 0) return null;

      return (
        <GallerySection
          key={section.id ?? `gallery-${index}`}
          title={section.title || "Recent Autoglass Work"}
          description={
            section.description ||
            "Explore recent windscreen replacements, repairs, recalibrations, and restoration work completed by our Tauranga team."
          }
          items={galleryData}
          headingComponent="h2"
          allLimit={9}
          filteredLimit={6}
        />
      );
    }
    if (section.acf_fc_layout === "show_usp") {
      if (!uspData) return null;
      return <UspAccordionSection key={index} data={uspData} />;
    }

    if (section.acf_fc_layout === "show_duct_cleaning_section") {
      if (!ductCleaning) return null;
      return <DuctCleaningSection key={index} data={ductCleaning} />;
    }
    
    if (section.acf_fc_layout === "show_stats" && section.show_stats) {
      return <Stats key={index} statsData={statsData} />;
    }
    if (section.acf_fc_layout === "show_locations" && section.show_locations) {
      const locationsData =
        locationsCovered ||
        section.locations_covered ||
        (section.locations ? section : null) ||
        DEFAULT_TAURANGA_LOCATIONS_CONTENT;

      return (
        <LocationsCovered
          key={index}
          title={locationsData.title || DEFAULT_TAURANGA_LOCATIONS_CONTENT.title}
          description={
            locationsData.description ||
            DEFAULT_TAURANGA_LOCATIONS_CONTENT.description
          }
          locations={
            locationsData.locations?.length
              ? locationsData.locations
              : DEFAULT_TAURANGA_LOCATIONS_CONTENT.locations
          }
          image={locationsData.image}
        />
      );
    }

    if (
      section.acf_fc_layout === "show_hours_calculator" &&
      section.show_hours_calculator
    ) {
      if (!hoursCalculatorData) return null;
      return (
        <HoursCalculator
          key={index}
          title={hoursCalculatorData.title}
          description={hoursCalculatorData.description}
          calculatedValueLabel={hoursCalculatorData.calculated_value_label}
          furnishedLevelData={hoursCalculatorData.furnished_level}
          price={section.price}
        />
      );
    }
    if (
      section.acf_fc_layout === "show_space_calculator" &&
      section.show_space_calculator
    ) {
      if (!spaceCalculatorData) return null;
      return (
        <SpaceCalculator
          key={index}
          title={spaceCalculatorData.title}
          description={spaceCalculatorData.description}
          calculatedValueLabel={spaceCalculatorData.calculated_value_label}
          furnishedLevelData={spaceCalculatorData.furnished_level}
          price={section.price}
        />
      );
    }
    if (section.acf_fc_layout === "show_services" && section.show_services) {
      if (servicesData === undefined) return null;
      return (
        <ServicesSection
          key={index}
          title={servicesData.title}
          subtitle={servicesData.subtitle}
          description={servicesData.description}
          cards={servicesData.cards}
        />
      );
    }
    if (section.acf_fc_layout === "service_cards_2_column") {
      return (
        <ServiceCardsTwoColumn
          key={index}
          title={section.section_title}
          cards={section.cards}
          cta={section.cta}
        />
      );
    }

    if (section.acf_fc_layout === "contact") {
      return (
        <ContactSection
          key={index}
          title={section.title}
          description={section.description}
          map={section.map}
          uspData={section.usp || uspData}
          contactInfo={contactInfo}
          socialData={socialData}
        ></ContactSection>
      );
    }
    if (section.acf_fc_layout === "cta_section") {
      return (
        <FooterCta
          key={index}
          title={section.title}
          description={section.description}
          ctaArray={section.cta}
        />
      );
    }
    if (
      section.acf_fc_layout === "show_reviews" &&
      section.show_reviews &&
      googleReviewsData
    ) {
      return <GoogleReviewsCarousel key={index} data={googleReviewsData} />;
    }

    if (section.acf_fc_layout === "show_usp_table") {
      console.log("usp table data", uspTable);
      return <UspTable key={index} uspTableData={uspTable} />;
    }
  });

  return <section>{sectionsJSX} </section>;
}
