"use client";

import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerLinks } from "@/utils/headerLinks";
import styles from "./Header.module.scss";

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setDesktopMenu(null);
    setMobileMenu(null);
  }, [pathname]);

  const isActive = (item) =>
    pathname === item.url ||
    item.subLinks?.some((subLink) => pathname === subLink.url);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setMobileMenu(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={isScrolled ? 4 : 0}
        className={styles.header}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters className={styles.toolbar}>
            <Link href="/" className={styles.logoLink} aria-label="AS Autoglass home">
              <Image
                src="/logo.png"
                width={52}
                height={52}
                alt=""
                className={styles.logo}
                priority
              />
              {/* <span className={styles.brandName}>
                AS <strong>Autoglass</strong>
              </span> */}
            </Link>

            <nav className={styles.desktopNavigation} aria-label="Main navigation">
              <ul className={styles.desktopList}>
                {headerLinks.map((item, index) => {
                  const isOpen = desktopMenu === item.url;
                  const hasSubLinks = Boolean(item.subLinks?.length);

                  return (
                    <li
                      className={styles.desktopItem}
                      key={`${item.id}-${item.url}`}
                      onMouseEnter={() => hasSubLinks && setDesktopMenu(item.url)}
                      onMouseLeave={() => hasSubLinks && setDesktopMenu(null)}
                    >
                      {hasSubLinks ? (
                        <button
                          type="button"
                          className={`${styles.desktopLink} ${
                            isActive(item) ? styles.active : ""
                          }`}
                          aria-expanded={isOpen}
                          aria-controls={`desktop-submenu-${index}`}
                          onClick={() =>
                            setDesktopMenu(isOpen ? null : item.url)
                          }
                        >
                          <Typography component="span" variant="body1">
                            {item.label}
                          </Typography>
                          <KeyboardArrowDownRoundedIcon
                            className={`${styles.arrow} ${
                              isOpen ? styles.arrowOpen : ""
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.url}
                          className={`${styles.desktopLink} ${
                            isActive(item) ? styles.active : ""
                          }`}
                        >
                          <Typography component="span" variant="body1">
                            {item.label}
                          </Typography>
                        </Link>
                      )}

                      {hasSubLinks && (
                        <ul
                          id={`desktop-submenu-${index}`}
                          className={`${styles.desktopSubmenu} ${
                            isOpen ? styles.desktopSubmenuOpen : ""
                          }`}
                        >
                          {item.subLinks.map((subLink) => (
                            <li key={subLink.url}>
                              <Link
                                href={subLink.url}
                                className={styles.submenuLink}
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
                                  <Typography component="span" variant="subtitle1">
                                    {subLink.label}
                                  </Typography>
                                  {subLink.subtitle && (
                                    <Typography component="span" variant="body2">
                                      {subLink.subtitle}
                                    </Typography>
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

              <Button
                component={Link}
                href="/book-now"
                size="large"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                className={styles.quoteButton}
              >
                Book Now
              </Button>
            </nav>

            <IconButton
              className={styles.menuButton}
              aria-label="Open navigation menu"
              aria-controls="mobile-navigation"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              color="primary"
            >
              <MenuRoundedIcon fontSize="large" />
            </IconButton>
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
            <Image src="/logo.png" width={48} height={48} alt="" />
            <span className={styles.brandName}>
              AS <strong>Autoglass</strong>
            </span>
          </Link>
          <IconButton aria-label="Close navigation menu" onClick={closeDrawer}>
            <CloseRoundedIcon />
          </IconButton>
        </div>

        <nav aria-label="Mobile navigation">
          <ul className={styles.mobileList}>
            {headerLinks.map((item, index) => {
              const isOpen = mobileMenu === item.url;
              const hasSubLinks = Boolean(item.subLinks?.length);

              return (
                <li className={styles.mobileItem} key={`${item.id}-${item.url}`}>
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
                      onClick={closeDrawer}
                    >
                      {item.label}
                    </Link>
                  )}

                  {hasSubLinks && isOpen && (
                    <ul
                      id={`mobile-submenu-${index}`}
                      className={styles.mobileSubmenu}
                    >
                      {item.subLinks.map((subLink) => (
                        <li key={subLink.url}>
                          <Link href={subLink.url} onClick={closeDrawer}>
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
                              <Typography component="span" variant="subtitle1">
                                {subLink.label}
                              </Typography>
                              {subLink.subtitle && (
                                <Typography component="span" variant="body2">
                                  {subLink.subtitle}
                                </Typography>
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
      </Drawer>
    </>
  );
}
