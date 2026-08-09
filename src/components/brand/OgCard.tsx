import type { CSSProperties } from "react";

const colors = {
  chrome: "#0B0B0C",
  accent: "#C9000C",
  accentOnDark: "#F75E54",
  inverse: "#F7F7F5",
  inverseMeta: "#8E8E96",
  ruleDark: "#26262C",
} as const;

const mono: CSSProperties = {
  fontFamily: "IBM Plex Mono",
  fontWeight: 400,
};

function InverseWordmark() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 6,
          height: 34,
          marginBottom: 3,
          backgroundColor: colors.inverse,
          transform: "skewX(-12deg)",
        }}
      />
      <div
        style={{
          display: "flex",
          width: 6,
          height: 20,
          marginRight: 22,
          marginBottom: 3,
          marginLeft: 7,
          backgroundColor: colors.accentOnDark,
          transform: "skewX(-12deg)",
        }}
      />
      <div
        style={{
          display: "flex",
          color: colors.inverse,
          fontFamily: "Anton",
          fontSize: 40,
          fontWeight: 400,
          letterSpacing: 0.4,
          lineHeight: 1,
        }}
      >
        MMA FILES
      </div>
    </div>
  );
}

export interface OgCardProps {
  headline: string;
  kicker?: string;
  date?: string;
  variant: "article" | "default";
}

/** Shared, photography-free 1200×630 card from the amended design handoff. */
export function OgCard({ headline, kicker, date, variant }: OgCardProps) {
  const article = variant === "article";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: colors.chrome,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          width: "100%",
          height: 6,
          backgroundColor: colors.accent,
        }}
      />

      <div style={{ position: "absolute", top: 64, left: 64, display: "flex" }}>
        <InverseWordmark />
      </div>

      <div
        style={{
          position: "absolute",
          right: 64,
          bottom: 190,
          left: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {kicker ? (
          <div
            style={{
              ...mono,
              display: "flex",
              marginBottom: 16,
              color: colors.accentOnDark,
              fontSize: 22,
              letterSpacing: "0.14em",
              lineHeight: 1.2,
              textTransform: "uppercase",
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            maxWidth: 1072,
            maxHeight: article ? 265 : 168,
            overflow: "hidden",
            color: colors.inverse,
            fontFamily: "Anton",
            fontSize: article ? 76 : 48,
            // Anton only ships at 400; amendment 1 overrides the stale 800 handoff value.
            fontWeight: 400,
            letterSpacing: article ? -0.5 : 0,
            lineHeight: 1.16,
            textTransform: article ? "uppercase" : "none",
          }}
        >
          {headline}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 64,
          bottom: 120,
          left: 64,
          display: "flex",
          height: 1,
          backgroundColor: colors.ruleDark,
        }}
      />

      <div
        style={{
          ...mono,
          position: "absolute",
          right: 64,
          bottom: 55,
          left: 64,
          display: "flex",
          justifyContent: "space-between",
          color: colors.inverseMeta,
          fontSize: 22,
          letterSpacing: "0.06em",
          lineHeight: 1,
        }}
      >
        <div style={{ display: "flex" }}>mmafiles.cz</div>
        {date ? <div style={{ display: "flex" }}>{date}</div> : null}
      </div>
    </div>
  );
}
