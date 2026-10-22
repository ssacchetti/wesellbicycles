import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Favicon – generated at build time. Hi-vis yellow stamp with ink "WS."
// matches the loud-knock OG card so the site has a consistent mark.
//
// Size is 192px (a multiple of 48) so Google will accept it for the
// favicon in search results – Google filters anything that isn't a
// multiple of 48, which is why 16/32/64 versions don't show up.

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default async function Icon() {
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
          fontSize: 114,
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
