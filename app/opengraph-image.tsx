import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Auto-detected by Next.js App Router. Generates a 1200×630 PNG and
// injects it as og:image / twitter:image.
//
// Composition: hi-vis yellow card with an ink stamp frame and the
// wordmark in massive condensed type. Designed to read as a *stamp* at
// thumb-scale in a feed, not as a shrunk-down homepage.

export const alt = "We Sell Bicycles – Used road bikes & parts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// --- design tokens (mirrored from globals.css) ----------------------------
const INK = "#0A0A0A";
const ACCENT = "#EAFF00";

async function loadFont(file: string): Promise<Buffer> {
  return readFile(join(process.cwd(), "public", "fonts", file));
}

export default async function Image() {
  const bricolage = await loadFont("BricolageGrotesque-ExtraBold.ttf");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ACCENT,
          color: INK,
          fontFamily: "Bricolage",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Stamp frame – inset 32px, 4px ink border */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: `4px solid ${INK}`,
          }}
        />

        {/* Wordmark – two-line stack, centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textTransform: "uppercase",
            lineHeight: 0.95,
            letterSpacing: "-0.015em",
          }}
        >
          <div style={{ fontSize: 220 }}>We Sell</div>
          <div
            style={{
              fontSize: 220,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span>Bicycles</span>
            <span>.</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bricolage",
          data: bricolage,
          style: "normal",
          weight: 800,
        },
      ],
    }
  );
}
