'use client'
import React from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";
// import EmailCircleIcon from "../Icons/EmailCircleIcon";
// import PhoneCircleIcon from "../Icons/PhoneCircleIcon";
// import LocationCircleIcon from "../Icons/LocationCircleIcon";
import Image from "next/image";
import styles from "./Footer.module.scss";
import Fab from '@mui/material/Fab';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
export default function ContactInfo({ contactInfo, className }) {
  
  if (contactInfo?.info?.length === 0) return null;
  const infoComponent = contactInfo?.info?.map((info, index) => {
    return (
      <Link href={info.url} key={index} className={`${styles.infoWrapper} flex gap-8 align-center pb-8 `}>
   
          {/* <Image src={info.icon.url} alt={info.icon.alt} width={info.icon.width} height={info.icon.height} /> */}
   

          <div className={`footer-contact-label body1 dark-body1 `}  dangerouslySetInnerHTML={{ __html: info.label }}></div>
   
      </Link>
    );
  });
  return (
    <>
    <div className={`${className} ${styles.contactInfoWrapper} footer-contact-wrapper flex flex-column`}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{
          mb: 1.75,
          color: "#fff",
          letterSpacing: 0,
          textTransform: "none",
        }}
      >
        Contact
      </Typography>
      {infoComponent}
    </div>


      <Fab className={styles.fabPhone} href={contactInfo.info[0].url} aria-label="Phone" > <LocalPhoneIcon color="white" sx={{fontSize: "2rem", color: "var(--dark-on-primary)"}}/> </Fab>

    </>
  );
}
