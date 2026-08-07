import React from 'react'
import styles from './ContactSection.module.scss'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import ContactForm from '@/Components/UI/Forms/ContactForm'
import Paper from '@mui/material/Paper'
import SocialWrapper from '@/Components/UI/Footer/SocialWrapper'
import Image from 'next/image'
import Link from 'next/link'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, "").trim();
const stripLabelPrefix = (value = "") => value.replace(/^[^:]+:\s*/, "").trim();

export default function ContactSection({title, description, map, contactInfo, uspData, socialData}) {
  const uspItems = Array.isArray(uspData)
    ? uspData
    : uspData?.text_usp || uspData?.items;
  const contactItems = contactInfo?.info || [];
  const phoneInfo = contactItems.find((item) => item.url?.startsWith("tel:")) || contactItems[0];
  const emailInfo = contactItems.find((item) => item.url?.startsWith("mailto:"));
  const addressInfo = contactItems.find((item) => {
    const label = stripHtml(item.label).toLowerCase();
    return label.includes("address") || item.url?.includes("maps");
  });
  const phoneValue = stripLabelPrefix(stripHtml(phoneInfo?.label));
  const emailValue = stripLabelPrefix(stripHtml(emailInfo?.label));
  const addressValue = stripLabelPrefix(stripHtml(addressInfo?.label));
  const contactCards = [
    phoneInfo && {
      eyebrow: "Call us",
      title: phoneValue,
      description: "Mon-Fri, 7am-5pm. After-hours queries returned next business day.",
      href: phoneInfo.url,
      icon: <LocalPhoneOutlinedIcon />,
    },
    emailInfo && {
      eyebrow: "Email us",
      title: emailValue,
      description: "Best for detailed enquiries, site plans, and compliance documents.",
      href: emailInfo.url,
      icon: <EmailOutlinedIcon />,
    },
 
    addressInfo && {
      eyebrow: "Visit us",
      title: addressValue,
      description: "By appointment - call ahead so we can make sure someone's available.",
      href: addressInfo.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressValue)}`,
      icon: <LocationOnOutlinedIcon />,
    },
  ].filter(Boolean);

  return (
    <section className={`${styles.section}`}>
      <Container maxWidth="lg" className={`${styles.container} contact-info-wrapper grid`}>
                <div className={`${styles.contactWraper}`}>
                   <Typography variant="h6" component="div" className={`${styles.subtitle} eyebrow-text mb-8`} >
          Get in touch

          </Typography>
                    <Typography variant="h2" component="h1" className="" color="var(--light-primary)" >
                        {title}
                        </Typography>
                        <Typography variant="body1" component="p" className="mt-24">
                        {description}
                        </Typography>
                        {uspItems?.length > 0 && (
                          <div className={`${styles.uspWrapper} mt-32`}>
                            {uspItems.map((item, index) => {
                              const icon = item.icon || item.image;
                              const text = item.value || item.label || item.title || item.description;

                              return (
                                <div className={styles.uspItem} key={index}>
                                  {icon?.url && (
                                    <span className={styles.uspIcon}>
                                      <Image
                                        src={icon.url}
                                        alt={icon.alt || ""}
                                        width={icon.width || 18}
                                        height={icon.height || 18}
                                      />
                                    </span>
                                  )}
                                  <Typography
                                    variant="body1"
                                    component="div"
                                    className={styles.uspText}
                                    dangerouslySetInnerHTML={{ __html: text }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {/* <div className={`${styles.socialWrapper} mt-8`}>
                            <SocialWrapper socialData={socialData} />
                            </div> */}

                </div>
                <Paper className={`${styles.contactFormWrapper} border-radius-16`} variant='outlined'>
                    <ContactForm/> 

                    </Paper> 


      </Container>
     
      {contactCards.length > 0 && (
        <Container maxWidth="xl" className={`${styles.contactCardsContainer} mt-56`}>
          <div className={styles.contactCardsGrid}>
            {contactCards.map((card, index) => (
              <Link href={card.href} className={styles.contactCard} key={index}>
                <span className={styles.contactCardIcon}>{card.icon}</span>
                <Typography variant="subtitle2" component="p" className={`${styles.contactCardEyebrow} eyebrow-text`} >
                  {card.eyebrow}
                </Typography>
                <Typography variant="h6" component="h3" className={styles.contactCardTitle}>
                  {card.title}
                </Typography>
                <Typography variant="body2" component="p" className={styles.contactCardDescription}>
                  {card.description}
                </Typography>
                <span className={styles.contactCardArrow}>
                  <ArrowForwardIcon fontSize="small" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      )}
   
                                          <div dangerouslySetInnerHTML={{ __html: map }} className='mt-40'/> 

    </section>
  )
}
