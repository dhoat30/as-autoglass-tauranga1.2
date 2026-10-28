import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import Image from "next/image";
import styles from "./Footer.module.scss";

const SOCIAL_LINKS = [
  {
    social_media_name: "Facebook",
    link: "https://www.facebook.com/people/AS-Auto-Glass-Tauranga/61580122882962/",
    Icon: FacebookIcon,
  },
  {
    social_media_name: "Instagram",
    link: "https://www.instagram.com/glassasauto/",
    Icon: InstagramIcon,
  },
];

export default function SocialWrapper({ socialData = [] }) {
  const links = [
    ...SOCIAL_LINKS,
    ...(socialData || []).filter(
      (social) =>
        social.link &&
        !/facebook|instagram/i.test(
          `${social.social_media_name} ${social.link}`,
        ),
    ),
  ];

  return (
    <nav className={styles.socialWrapper} aria-label="Social media">
      {links.map(({ social_media_name: name, link, Icon, social_media_icon }) => (
        <a
          key={link}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label={`${name} (opens in a new tab)`}
        >
          {Icon ? (
            <Icon aria-hidden="true" fontSize="small" />
          ) : social_media_icon?.url ? (
            <Image src={social_media_icon.url} alt="" width={20} height={20} />
          ) : null}
          <span>{name}</span>
        </a>
      ))}
    </nav>
  );
}
