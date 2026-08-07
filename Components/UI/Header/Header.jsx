"use client";

import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerLinks } from "@/utils/headerLinks";
import styles from "./Header.module.scss";

const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "07 543 0009";
const PHONE_URL = `tel:${PHONE.replace(/[^\d+]/g, "")}`;

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setDesktopMenu(null);
    setMobileMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!desktopMenu) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setDesktopMenu(null);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [desktopMenu]);

  const isCurrent = (url) => pathname === url;
  const isActive = (item) =>
    isCurrent(item.url) ||
    item.subLinks?.some((subLink) => isCurrent(subLink.url));

  const closeDrawer = () => {
    setDrawerOpen(false);
    setMobileMenu(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters className={styles.toolbar}>
            <Link href="/" className={styles.logoLink} aria-label="AS Autoglass home">
              <Image
                src="/logo.png"
                width={48}
                height={48}
                alt=""
                className={styles.logo}
                priority
              />
              <span className={styles.brandName}>
                AS <strong>Autoglass</strong>
              </span>
            </Link>

            <nav className={styles.desktopNavigation} aria-label="Main navigation">
              <ul className={styles.desktopList}>
                {headerLinks.map((item, index) => {
                  const isOpen = desktopMenu === item.url;
                  const hasSubLinks = Boolean(item.subLinks?.length);
                  const linkClass = `${styles.desktopLink} ${
                    isActive(item) ? styles.active : ""
                  }`;

                  return (
                    <li
                      className={styles.desktopItem}
                      key={item.id}
                      onMouseEnter={() => hasSubLinks && setDesktopMenu(item.url)}
                      onMouseLeave={() => hasSubLinks && setDesktopMenu(null)}
                    >
                      {hasSubLinks ? (
                        <button
                          type="button"
                          className={linkClass}
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                          aria-controls={`desktop-submenu-${index}`}
                          onClick={() =>
                            setDesktopMenu(isOpen ? null : item.url)
                          }
                        >
                          <span>{item.label}</span>
                          <KeyboardArrowDownRoundedIcon
                            className={`${styles.arrow} ${
                              isOpen ? styles.arrowOpen : ""
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.url}
                          className={linkClass}
                          aria-current={isCurrent(item.url) ? "page" : undefined}
                        >
                          <span>{item.label}</span>
                        </Link>
                      )}

                      {hasSubLinks && (
                        <div
                          className={`${styles.submenuWrapper} ${
                            isOpen ? styles.submenuWrapperOpen : ""
                          }`}
                        >
                          <ul
                            id={`desktop-submenu-${index}`}
                            className={styles.desktopSubmenu}
                          >
                            {item.subLinks.map((subLink) => (
                              <li key={subLink.url}>
                                <Link
                                  href={subLink.url}
                                  className={`${styles.submenuLink} ${
                                    isCurrent(subLink.url)
                                      ? styles.submenuLinkActive
                                      : ""
                                  }`}
                                  aria-current={
                                    isCurrent(subLink.url) ? "page" : undefined
                                  }
                                  onClick={() => setDesktopMenu(null)}
                                >
                                  {subLink.graphic && (
                                    <Image
                                      className={styles.submenuIcon}
                                      src={subLink.graphic}
                                      alt=""
                                      width={48}
                                      height={48}
                                    />
                                  )}
                                  <span className={styles.submenuLabel}>
                                    <strong>{subLink.label}</strong>
                                    {subLink.subtitle && (
                                      <small>{subLink.subtitle}</small>
                                    )}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className={styles.actions}>
                <a href={PHONE_URL} className={styles.phoneLink}>
                  <LocalPhoneOutlinedIcon aria-hidden="true" />
                  <span className={styles.phoneText}>
                    <small>Call us today</small>
                    <strong>{PHONE}</strong>
                  </span>
                </a>

                <Button
                  component={Link}
                  href="/book-now"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  className={styles.quoteButton}
                >
                  Book Now
                </Button>
              </div>
            </nav>

            <div className={styles.mobileActions}>
              <IconButton
                component="a"
                href={PHONE_URL}
                className={styles.mobilePhoneButton}
                aria-label={`Call AS Autoglass on ${PHONE}`}
              >
                <LocalPhoneOutlinedIcon />
              </IconButton>
              <IconButton
                className={styles.menuButton}
                aria-label="Open navigation menu"
                aria-controls="mobile-navigation"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuRoundedIcon fontSize="large" />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        id="mobile-navigation"
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        className={styles.drawer}
        classes={{ paper: styles.drawerPaper }}
        ModalProps={{ keepMounted: true }}
      >
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.drawerLogo} onClick={closeDrawer}>
            <Image src="/logo.png" width={44} height={44} alt="" />
            <span className={styles.brandName}>
              AS <strong>Autoglass</strong>
            </span>
          </Link>
          <IconButton aria-label="Close navigation menu" onClick={closeDrawer}>
            <CloseRoundedIcon />
          </IconButton>
        </div>

        <nav aria-label="Mobile navigation" className={styles.drawerNav}>
          <ul className={styles.mobileList}>
            {headerLinks.map((item, index) => {
              const isOpen = mobileMenu === item.url;
              const hasSubLinks = Boolean(item.subLinks?.length);

              return (
                <li className={styles.mobileItem} key={item.id}>
                  {hasSubLinks ? (
                    <button
                      type="button"
                      className={`${styles.mobileLink} ${
                        isActive(item) ? styles.mobileActive : ""
                      }`}
                      aria-expanded={isOpen}
                      aria-controls={`mobile-submenu-${index}`}
                      onClick={() => setMobileMenu(isOpen ? null : item.url)}
                    >
                      <span>{item.label}</span>
                      <KeyboardArrowDownRoundedIcon
                        className={`${styles.arrow} ${
                          isOpen ? styles.arrowOpen : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.url}
                      className={`${styles.mobileLink} ${
                        isActive(item) ? styles.mobileActive : ""
                      }`}
                      aria-current={isCurrent(item.url) ? "page" : undefined}
                      onClick={closeDrawer}
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {hasSubLinks && isOpen && (
                    <ul
                      id={`mobile-submenu-${index}`}
                      className={styles.mobileSubmenu}
                    >
                      {item.subLinks.map((subLink) => (
                        <li key={subLink.url}>
                          <Link
                            href={subLink.url}
                            className={
                              isCurrent(subLink.url)
                                ? styles.mobileSubmenuActive
                                : undefined
                            }
                            aria-current={
                              isCurrent(subLink.url) ? "page" : undefined
                            }
                            onClick={closeDrawer}
                          >
                            {subLink.graphic && (
                              <Image
                                src={subLink.graphic}
                                alt=""
                                width={40}
                                height={40}
                                className={styles.mobileSubmenuIcon}
                              />
                            )}
                            <span className={styles.submenuLabel}>
                              <strong>{subLink.label}</strong>
                              {subLink.subtitle && (
                                <small>{subLink.subtitle}</small>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.drawerFooter}>
          <Button
            component={Link}
            href="/book-now"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            className={styles.mobileQuoteButton}
            onClick={closeDrawer}
          >
            Book Now
          </Button>
          <a href={PHONE_URL} className={styles.drawerPhoneLink}>
            <LocalPhoneOutlinedIcon aria-hidden="true" />
            <span>
              Prefer to talk? <strong>{PHONE}</strong>
            </span>
          </a>
        </div>
      </Drawer>
    </>
  );
}
