import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Apple touch icon – generated at build time. Used by iOS when the site
// is added to the home screen. Same hi-vis stamp as the favicon, scaled.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await readFile(
    join(process.cwd(), "public", "fonts", "BricolageGrotesque-ExtraBold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EAFF00",
          color: "#0A0A0A",
          fontFamily: "Bricolage",
          fontSize: 108,
          letterSpacing: "-0.05em",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        WS
        <span style={{ color: "#0A0A0A" }}>.</span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bricolage", data: font, weight: 800, style: "normal" }],
    }
  );
}
