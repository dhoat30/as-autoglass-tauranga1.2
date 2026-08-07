import { readFile } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";
import { siteName } from "@/site.config";

export const alt = `${siteName} — Windscreen Repair & Replacement Tauranga`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          backgroundColor: "#0b130e",
        }}
      >
        <img src={logoSrc} width={260} height={256} alt="" />
        <div
          style={{
            color: "#ffffff",
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            color: "#b8c4bd",
            fontSize: 30,
          }}
        >
          Windscreen Repair &amp; Replacement · Tauranga
        </div>
      </div>
    ),
    size
  );
}
