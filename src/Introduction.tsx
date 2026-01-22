import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";

// Load fonts
const { fontFamily: outfitFont } = loadOutfit("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: geistFont } = loadGeist("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

// Light mode colors
const COLORS = {
  background: "#ffffff",
  backgroundGradient: "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
  text: "#18181b",
  textMuted: "#71717a",
  glass: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(0, 0, 0, 0.08)",
  cardBg: "rgba(249, 250, 251, 0.8)",
  particle: "rgba(0, 0, 0, 0.06)",
  accent: "rgba(0, 0, 0, 0.85)",
};

const PROFILE_DATA = {
  name: "Ankur Kakroo",
  title: "Director of Engineering",
  company: "HackerRank",

  identity: "Asymmetric engineering leader for the AI era",
  strengths: [
    "Strong business, product & design sense",
    "Moves across altitude with ease",
    "Ships fast with high bias for action",
  ],

  professional: [
    "Building AI Interviewer (0 → 1)",
    "Modernizing API, Web & AI platforms",
  ],
  liberation: "AI agents collapsed the gap between idea and execution",

  insights: [
    "The harness matters more than the model",
    "Token abundance replaced cognitive load",
    "Building became ambient, not specialized",
  ],

  buildingTheme: "Applied learning in unfamiliar terrain",
  experiments: [
    "Hardware hacking with my kid",
    "Kindle dashboards via agents",
    "Audio-reactive particles",
    "Mobile-first development",
  ],

  frontier: ["LLMs", "RAG", "AI Agents"],
  core: ["Python", "JavaScript", "React", "FastAPI"],
  platform: ["API Systems", "Web Platforms", "AWS"],

  contact: {
    email: "ankurkakroo2@gmail.com",
    github: "github.com/ankurkakroo2",
    linkedin: "linkedin.com/in/akakro",
  },
};

// ============ UTILITIES ============

// Character-by-character text animation (only for key emphasis)
const TypewriterText: React.FC<{
  text: string;
  style?: React.CSSProperties;
  delay?: number;
  speed?: number;
}> = ({ text, style, delay = 0, speed = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveFrame = Math.max(0, frame - delay);
  const progress = interpolate(effectiveFrame, [0, text.length * speed * fps / 60], [0, text.length], {
    extrapolateRight: "clamp",
  });

  return (
    <span style={style}>
      {text.slice(0, Math.ceil(progress))}
      {progress < text.length && (
        <span style={{
          opacity: 0.5 + Math.sin(effectiveFrame * 0.3) * 0.5,
        }}>|</span>
      )}
    </span>
  );
};

// 3D Camera wrapper with enhanced movement
const Camera3D: React.FC<{
  children: React.ReactNode;
  rotateX?: number;
  rotateY?: number;
  translateZ?: number;
  perspectiveOriginX?: number;
  perspectiveOriginY?: number;
}> = ({
  children,
  rotateX = 0,
  rotateY = 0,
  translateZ = 0,
  perspectiveOriginX = 50,
  perspectiveOriginY = 50,
}) => (
  <AbsoluteFill style={{ perspective: 1200, perspectiveOrigin: `${perspectiveOriginX}% ${perspectiveOriginY}%` }}>
    <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)` }}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

// Enhanced particle field with more depth
const ParticleField: React.FC<{ seed?: number }> = ({ seed = 0 }) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 50 }, (_, i) => {
    const x = ((i * 137.5 + seed * 50) % 100);
    const y = ((i * 73.7 + seed * 30) % 100);
    const z = (i % 5) * -120 - 40;
    const size = 1 + (i % 4) * 1.2;
    const yOffset = Math.sin((frame * 0.25 + i * 12) * 0.015) * 25;
    const xOffset = Math.cos((frame * 0.2 + i * 10) * 0.012) * 15;
    const opacity = 0.02 + (i % 4) * 0.015 + Math.sin(frame * 0.02 + i) * 0.01;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: COLORS.particle,
          transform: `translateZ(${z}px) translateY(${yOffset}px) translateX(${xOffset}px)`,
          opacity,
        }}
      />
    );
  });
  return <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>{particles}</AbsoluteFill>;
};

// Depth layer with parallax
const DepthLayer: React.FC<{ children: React.ReactNode; z: number; opacity?: number }> = ({
  children, z, opacity = 1,
}) => (
  <AbsoluteFill style={{ transform: `translateZ(${z}px)`, opacity, transformStyle: "preserve-3d" }}>
    {children}
  </AbsoluteFill>
);

// Glass card with enhanced shadows
const glassCard = (extraStyles = {}) => ({
  background: COLORS.glass,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: `1px solid ${COLORS.glassBorder}`,
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
  ...extraStyles,
});

// Floating animation helper
const useFloat = (frame: number, speed: number = 1, amplitude: number = 5) => {
  return Math.sin(frame * 0.02 * speed) * amplitude;
};

// ============ SCENE 1: TITLE ============
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // More dynamic camera movement
  const cameraY = interpolate(frame, [0, 180], [3, -2], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraX = interpolate(frame, [0, 180], [-2, 1.5], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraZ = interpolate(frame, [0, 180], [-50, 20], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  // Smooth name entrance (no bounce)
  const nameSpring = spring({ frame, fps, config: { damping: 200 } });
  const titleSpring = spring({ frame, fps, config: { damping: 200 }, delay: 15 });
  const lineSpring = spring({ frame, fps, config: { damping: 200 }, delay: 25 });

  const floatY = useFloat(frame, 0.8, 4);

  return (
    <AbsoluteFill style={{ background: COLORS.backgroundGradient }}>
      <Camera3D rotateX={cameraX} rotateY={cameraY} translateZ={cameraZ}>
        <ParticleField />
        {/* Background depth layers */}
        <DepthLayer z={-200} opacity={0.15}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{
              width: 700,
              height: 700,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)",
              transform: `translateY(${floatY}px)`,
            }} />
          </AbsoluteFill>
        </DepthLayer>

        <DepthLayer z={0}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", transformStyle: "preserve-3d" }}>
              <h1 style={{
                fontFamily: outfitFont,
                fontSize: 140,
                fontWeight: 700,
                color: COLORS.text,
                margin: 0,
                opacity: nameSpring,
                transform: `translateY(${interpolate(nameSpring, [0, 1], [100, 0])}px) translateZ(${interpolate(nameSpring, [0, 1], [-120, 0])}px) scale(${interpolate(nameSpring, [0, 1], [0.9, 1])})`,
                letterSpacing: "-5px",
                textShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}>
                {PROFILE_DATA.name}
              </h1>
              <div style={{
                width: interpolate(lineSpring, [0, 1], [0, 400]),
                height: 2,
                background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)",
                margin: "40px auto",
                opacity: lineSpring,
                borderRadius: 1,
              }} />
              <p style={{
                fontFamily: geistFont,
                fontSize: 48,
                color: COLORS.text,
                margin: 0,
                opacity: titleSpring,
                transform: `translateZ(${interpolate(titleSpring, [0, 1], [-60, 0])}px)`,
                fontWeight: 500,
              }}>
                {PROFILE_DATA.title}
              </p>
              <p style={{
                fontFamily: geistFont,
                fontSize: 34,
                color: COLORS.textMuted,
                margin: "16px 0 0 0",
                opacity: titleSpring,
                fontWeight: 400,
                transform: `translateZ(${interpolate(titleSpring, [0, 1], [-40, 0])}px)`,
              }}>
                @ {PROFILE_DATA.company}
              </p>
            </div>
          </AbsoluteFill>
        </DepthLayer>
      </Camera3D>
    </AbsoluteFill>
  );
};

// ============ SCENE 2: WHO I AM ============
const WhoIAmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraY = interpolate(frame, [0, 210], [-4, 4], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraOriginX = interpolate(frame, [0, 210], [42, 58], { extrapolateRight: "clamp" });

  const identitySpring = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ background: COLORS.backgroundGradient }}>
      <Camera3D rotateY={cameraY} perspectiveOriginX={cameraOriginX}>
        <ParticleField seed={1} />
        <DepthLayer z={0}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", maxWidth: 1400, padding: "0 80px", transformStyle: "preserve-3d" }}>
              <p style={{
                fontFamily: geistFont,
                fontSize: 20,
                color: COLORS.textMuted,
                margin: "0 0 55px 0",
                textTransform: "uppercase",
                letterSpacing: 10,
                fontWeight: 500,
                opacity: identitySpring,
              }}>
                Who I Am
              </p>
              <h2 style={{
                fontFamily: outfitFont,
                fontSize: 68,
                fontWeight: 700,
                color: COLORS.text,
                margin: "0 0 60px 0",
                lineHeight: 1.15,
                letterSpacing: "-2px",
                opacity: identitySpring,
                transform: `translateZ(${interpolate(identitySpring, [0, 1], [-90, 0])}px) scale(${interpolate(identitySpring, [0, 1], [0.94, 1])})`,
                textShadow: "0 6px 20px rgba(0,0,0,0.08)",
              }}>
                {PROFILE_DATA.identity}
              </h2>
              <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", transformStyle: "preserve-3d" }}>
                {PROFILE_DATA.strengths.map((strength, i) => {
                  const itemSpring = spring({ frame, fps, config: { damping: 200 }, delay: 30 + i * 15 });
                  const itemZ = interpolate(itemSpring, [0, 1], [-80, -i * 12]);
                  const floatY = useFloat(frame, 0.6 + i * 0.2, 3);
                  return (
                    <div key={i} style={{
                      ...glassCard({ borderRadius: 16, padding: "24px 36px" }),
                      opacity: itemSpring,
                      transform: `translateY(${floatY}px) translateZ(${itemZ}px) scale(${interpolate(itemSpring, [0, 1], [0.9, 1])})`,
                    }}>
                      <p style={{ fontFamily: geistFont, fontSize: 24, color: COLORS.text, margin: 0, fontWeight: 500 }}>
                        {strength}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </AbsoluteFill>
        </DepthLayer>
      </Camera3D>
    </AbsoluteFill>
  );
};

// ============ SCENE 3: CURRENT FOCUS ============
const CurrentFocusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraX = interpolate(frame, [0, 270], [3, -3], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraY = interpolate(frame, [0, 270], [-3, 3], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraZ = interpolate(frame, [0, 270], [20, -30], { extrapolateRight: "clamp" });

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });
  const proSpring = spring({ frame, fps, config: { damping: 200 }, delay: 15 });
  const libSpring = spring({ frame, fps, config: { damping: 200 }, delay: 60 });

  return (
    <AbsoluteFill style={{ background: COLORS.backgroundGradient }}>
      <Camera3D rotateX={cameraX} rotateY={cameraY} translateZ={cameraZ}>
        <ParticleField seed={2} />
        <DepthLayer z={-80} opacity={0.12}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: outfitFont, fontSize: 200, fontWeight: 700, color: "rgba(0,0,0,0.015)", letterSpacing: "-5px" }}>
              FOCUS
            </div>
          </AbsoluteFill>
        </DepthLayer>
        <DepthLayer z={0}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", padding: "0 100px", transformStyle: "preserve-3d" }}>
              <p style={{
                fontFamily: geistFont,
                fontSize: 20,
                color: COLORS.textMuted,
                margin: "0 0 50px 0",
                textTransform: "uppercase",
                letterSpacing: 10,
                fontWeight: 500,
                opacity: titleSpring,
              }}>
                Current Focus
              </p>

              <div style={{ marginBottom: 65, transformStyle: "preserve-3d" }}>
                {PROFILE_DATA.professional.map((item, i) => {
                  const itemSpring = spring({ frame, fps, config: { damping: 200 }, delay: 20 + i * 15 });
                  const floatY = useFloat(frame, 0.5 + i * 0.3, 4);
                  return (
                    <div key={i} style={{
                      ...glassCard({ borderRadius: 16, padding: "24px 44px", marginBottom: 18, display: "inline-block", marginRight: 18 }),
                      opacity: itemSpring,
                      transform: `translateY(${floatY}px) translateZ(${interpolate(itemSpring, [0, 1], [-90, -i * 12])}px)`,
                    }}>
                      <p style={{ fontFamily: geistFont, fontSize: 26, color: COLORS.text, margin: 0, fontWeight: 500 }}>
                        {item}
                      </p>
                    </div>
                  );
                })}
              </div>

              <h2 style={{
                fontFamily: outfitFont,
                fontSize: 58,
                fontWeight: 700,
                color: COLORS.text,
                margin: 0,
                lineHeight: 1.25,
                letterSpacing: "-1px",
                maxWidth: 1100,
                marginLeft: "auto",
                marginRight: "auto",
                opacity: libSpring,
                transform: `translateZ(${interpolate(libSpring, [0, 1], [-70, 0])}px) scale(${interpolate(libSpring, [0, 1], [0.95, 1])})`,
                textShadow: "0 6px 20px rgba(0,0,0,0.08)",
              }}>
                <TypewriterText
                  text={PROFILE_DATA.liberation}
                  speed={2}
                  delay={70}
                />
              </h2>
            </div>
          </AbsoluteFill>
        </DepthLayer>
      </Camera3D>
    </AbsoluteFill>
  );
};

// ============ SCENE 4: THE SHIFT ============
const ShiftScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraX = interpolate(frame, [0, 240], [-2.5, 2.5], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraZ = interpolate(frame, [0, 240], [40, -25], { extrapolateRight: "clamp" });
  const cameraY = interpolate(frame, [0, 240], [-1, 1], { extrapolateRight: "clamp" });

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });

  // Timeline line animation
  const lineProgress = spring({ frame, fps, config: { damping: 200 }, delay: 15 });
  const lineHeight = interpolate(lineProgress, [0, 1], [0, 400]);

  return (
    <AbsoluteFill style={{ background: COLORS.backgroundGradient }}>
      <Camera3D rotateX={cameraX} rotateY={cameraY} translateZ={cameraZ}>
        <ParticleField seed={3} />
        <DepthLayer z={-140} opacity={0.2}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: outfitFont, fontSize: 300, fontWeight: 700, color: "rgba(0,0,0,0.012)", letterSpacing: "-10px" }}>
              SHIFT
            </div>
          </AbsoluteFill>
        </DepthLayer>
        <DepthLayer z={0}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", maxWidth: 1300, padding: "0 60px", transformStyle: "preserve-3d" }}>
              <p style={{
                fontFamily: geistFont,
                fontSize: 20,
                color: COLORS.textMuted,
                margin: "0 0 75px 0",
                textTransform: "uppercase",
                letterSpacing: 10,
                fontWeight: 500,
                opacity: titleSpring,
              }}>
                The Shift
              </p>

              {/* Timeline-style layout with dots and cards */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 50 }}>
                {/* Animated vertical line */}
                <div style={{
                  position: "absolute",
                  left: "50%",
                  top: 20,
                  width: 2,
                  height: lineHeight,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.15), rgba(0,0,0,0.06))",
                  transform: "translateX(-50%)",
                  borderRadius: 1,
                }} />

                {PROFILE_DATA.insights.map((insight, i) => {
                  const itemSpring = spring({ frame, fps, config: { damping: 200 }, delay: 25 + i * 25 });
                  const itemZ = interpolate(itemSpring, [0, 1], [-110, -i * 15]);
                  const itemScale = interpolate(itemSpring, [0, 1], [0.88, 1]);
                  const floatY = useFloat(frame, 0.4 + i * 0.25, 3);
                  const isLeft = i % 2 === 0;
                  const targetX = interpolate(itemSpring, [0, 1], [isLeft ? -50 : 50, 0]);

                  // Dot animation
                  const dotScale = spring({ frame, fps, config: { damping: 200 }, delay: 20 + i * 25 });
                  const dotOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 15 + i * 25 });

                  return (
                    <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: isLeft ? "flex-start" : "flex-end" }}>
                      {/* Center dot */}
                      <div style={{
                        position: "absolute",
                        left: "50%",
                        width: interpolate(dotScale, [0, 1], [0, 16]),
                        height: interpolate(dotScale, [0, 1], [0, 16]),
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.12)",
                        transform: `translateX(-50%) scale(${dotScale})`,
                        opacity: dotOpacity,
                        zIndex: 10,
                        boxShadow: "0 0 0 4px rgba(0,0,0,0.03)",
                      }} />

                      {/* Card */}
                      <div style={{
                        width: isLeft ? "calc(50% - 70px)" : "calc(50% - 70px)",
                        marginLeft: isLeft ? 0 : "calc(50% + 40px)",
                        marginRight: isLeft ? "calc(50% + 40px)" : 0,
                        transformStyle: "preserve-3d",
                      }}>
                        <div style={{
                          ...glassCard({ borderRadius: 20, padding: "30px 48px", textAlign: isLeft ? "right" : "left" }),
                          opacity: itemSpring,
                          transform: `translateY(${floatY}px) translateX(${targetX}px) translateZ(${itemZ}px) scale(${itemScale})`,
                        }}>
                          <p style={{
                            fontFamily: geistFont,
                            fontSize: 27,
                            color: COLORS.text,
                            margin: 0,
                            fontWeight: 500,
                            lineHeight: 1.35,
                          }}>
                            {insight}
                          </p>
                          <p style={{
                            fontFamily: geistFont,
                            fontSize: 13,
                            color: COLORS.textMuted,
                            margin: "10px 0 0 0",
                            fontWeight: 500,
                            letterSpacing: 2,
                          }}>
                            {i === 0 ? "BEFORE" : i === 1 ? "DURING" : "AFTER"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AbsoluteFill>
        </DepthLayer>
      </Camera3D>
    </AbsoluteFill>
  );
};

// ============ SCENE 5: BUILDING ============
const BuildingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraY = interpolate(frame, [0, 240], [6, -6], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraZ = interpolate(frame, [0, 240], [25, -15], { extrapolateRight: "clamp" });

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });
  const themeSpring = spring({ frame, fps, config: { damping: 200 }, delay: 20 });

  return (
    <AbsoluteFill style={{ background: COLORS.backgroundGradient }}>
      <Camera3D rotateY={cameraY} translateZ={cameraZ}>
        <ParticleField seed={4} />
        <DepthLayer z={0}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", padding: "0 80px", transformStyle: "preserve-3d" }}>
              <p style={{
                fontFamily: geistFont,
                fontSize: 20,
                color: COLORS.textMuted,
                margin: "0 0 50px 0",
                textTransform: "uppercase",
                letterSpacing: 10,
                fontWeight: 500,
                opacity: titleSpring,
              }}>
                Building in Public
              </p>
              <h2 style={{
                fontFamily: outfitFont,
                fontSize: 64,
                fontWeight: 700,
                color: COLORS.text,
                margin: "0 0 65px 0",
                lineHeight: 1.15,
                letterSpacing: "-2px",
                opacity: themeSpring,
                transform: `translateZ(${interpolate(themeSpring, [0, 1], [-70, 0])}px) scale(${interpolate(themeSpring, [0, 1], [0.94, 1])})`,
                textShadow: "0 6px 20px rgba(0,0,0,0.08)",
              }}>
                {PROFILE_DATA.buildingTheme}
              </h2>
              <div style={{ display: "flex", justifyContent: "center", gap: 22, flexWrap: "wrap", transformStyle: "preserve-3d" }}>
                {PROFILE_DATA.experiments.map((exp, i) => {
                  const itemSpring = spring({ frame, fps, config: { damping: 200 }, delay: 45 + i * 10 });
                  const itemZ = interpolate(itemSpring, [0, 1], [-90, -15 + (i % 2) * 25]);
                  const floatY = useFloat(frame, 0.5 + i * 0.2, 4);
                  const floatX = Math.cos((frame + i * 35) * 0.015) * 2;
                  return (
                    <div key={i} style={{
                      ...glassCard({ borderRadius: 100, padding: "20px 38px" }),
                      opacity: itemSpring,
                      transform: `translateY(${floatY}px) translateX(${floatX}px) translateZ(${itemZ}px) scale(${interpolate(itemSpring, [0, 1], [0.9, 1])})`,
                    }}>
                      <p style={{ fontFamily: geistFont, fontSize: 22, color: COLORS.text, margin: 0, fontWeight: 500 }}>
                        {exp}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </AbsoluteFill>
        </DepthLayer>
      </Camera3D>
    </AbsoluteFill>
  );
};

// ============ SCENE 6: SKILLS ============
const SkillsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraY = interpolate(frame, [0, 210], [-5, 5], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraX = interpolate(frame, [0, 210], [2.5, -2.5], { extrapolateRight: "clamp" });
  const cameraZ = interpolate(frame, [0, 210], [15, -20], { extrapolateRight: "clamp" });

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });

  const allSkills = [
    { label: "Frontier", items: PROFILE_DATA.frontier, delay: 5 },
    { label: "Core", items: PROFILE_DATA.core, delay: 35 },
    { label: "Platform", items: PROFILE_DATA.platform, delay: 65 },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.backgroundGradient }}>
      <Camera3D rotateX={cameraX} rotateY={cameraY} translateZ={cameraZ}>
        <ParticleField seed={5} />
        <DepthLayer z={-100} opacity={0.15}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: outfitFont, fontSize: 250, fontWeight: 700, color: "rgba(0,0,0,0.012)", letterSpacing: "-8px" }}>
              STACK
            </div>
          </AbsoluteFill>
        </DepthLayer>
        <DepthLayer z={0}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", transformStyle: "preserve-3d" }}>
              <p style={{
                fontFamily: geistFont,
                fontSize: 20,
                color: COLORS.textMuted,
                margin: "0 0 55px 0",
                textTransform: "uppercase",
                letterSpacing: 10,
                fontWeight: 500,
                opacity: titleSpring,
              }}>
                Tech Stack
              </p>
              {allSkills.map((group, gi) => {
                const groupSpring = spring({ frame, fps, config: { damping: 200 }, delay: group.delay });
                return (
                  <div key={gi} style={{ marginBottom: 35, opacity: groupSpring, transformStyle: "preserve-3d" }}>
                    <p style={{ fontFamily: geistFont, fontSize: 14, color: COLORS.textMuted, margin: "0 0 18px 0", textTransform: "uppercase", letterSpacing: 5, fontWeight: 500 }}>
                      {group.label}
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
                      {group.items.map((skill, i) => {
                        const itemSpring = spring({ frame, fps, config: { damping: 200 }, delay: group.delay + 8 + i * 8 });
                        const itemZ = interpolate(itemSpring, [0, 1], [-90, 0]);
                        const floatY = useFloat(frame, 0.6 + i * 0.15 + gi * 0.3, 3);
                        const floatX = Math.sin((frame + i * 20 + gi * 40) * 0.02) * 2;
                        const isFrontier = gi === 0;
                        return (
                          <div key={i} style={{
                            ...glassCard({
                              borderRadius: 100,
                              padding: isFrontier ? "22px 42px" : "18px 34px",
                              background: isFrontier ? "rgba(248, 250, 252, 0.9)" : COLORS.glass,
                              border: `1px solid ${isFrontier ? "rgba(0,0,0,0.12)" : COLORS.glassBorder}`,
                            }),
                            opacity: itemSpring,
                            transform: `translateY(${floatY}px) translateX(${floatX}px) translateZ(${itemZ}px) scale(${interpolate(itemSpring, [0, 1], [0.9, 1])})`,
                          }}>
                            <p style={{ fontFamily: geistFont, fontSize: isFrontier ? 28 : 22, color: COLORS.text, margin: 0, fontWeight: 500 }}>
                              {skill}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        </DepthLayer>
      </Camera3D>
    </AbsoluteFill>
  );
};

// ============ SCENE 7: CONTACT ============
const ContactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraZ = interpolate(frame, [0, 210], [-70, 25], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const cameraY = interpolate(frame, [0, 210], [4, -2], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const cameraX = interpolate(frame, [0, 210], [1, -1], { extrapolateRight: "clamp" });

  const containerSpring = spring({ frame, fps, config: { damping: 200 } });
  const nameSpring = spring({ frame, fps, config: { damping: 200 }, delay: 15 });

  const contacts = [
    { icon: "✉", text: PROFILE_DATA.contact.email },
    { icon: "⌘", text: PROFILE_DATA.contact.github },
    { icon: "◈", text: PROFILE_DATA.contact.linkedin },
  ];

  const floatY = useFloat(frame, 0.4, 3);

  return (
    <AbsoluteFill style={{ background: COLORS.backgroundGradient }}>
      <Camera3D rotateY={cameraY} rotateX={cameraX} translateZ={cameraZ}>
        <ParticleField seed={6} />
        <DepthLayer z={-180} opacity={0.18}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{
              width: 550,
              height: 550,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 60%)",
              transform: `translateY(${floatY}px)`,
            }} />
          </AbsoluteFill>
        </DepthLayer>
        <DepthLayer z={0}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: containerSpring }}>
            <div style={{ textAlign: "center", transformStyle: "preserve-3d" }}>
              <h2 style={{
                fontFamily: outfitFont,
                fontSize: 90,
                fontWeight: 700,
                color: COLORS.text,
                margin: "0 0 30px 0",
                transform: `translateZ(${interpolate(nameSpring, [0, 1], [-60, 0])}px) scale(${interpolate(nameSpring, [0, 1], [0.9, 1])})`,
                letterSpacing: "-4px",
                textShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}>
                Let's Connect
              </h2>
              <div style={{
                width: interpolate(nameSpring, [0, 1], [0, 180]),
                height: 2,
                background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)",
                margin: "0 auto 60px auto",
                borderRadius: 1,
              }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", transformStyle: "preserve-3d" }}>
                {contacts.map((contact, i) => {
                  const itemSpring = spring({ frame, fps, config: { damping: 200 }, delay: 25 + i * 15 });
                  const itemZ = interpolate(itemSpring, [0, 1], [-50, -i * 8]);
                  const itemX = interpolate(itemSpring, [0, 1], [-30, 0]);
                  const floatY = useFloat(frame, 0.3 + i * 0.2, 2.5);
                  return (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      opacity: itemSpring,
                      transform: `translateY(${floatY}px) translateX(${itemX}px) translateZ(${itemZ}px) scale(${interpolate(itemSpring, [0, 1], [0.92, 1])})`,
                    }}>
                      <span style={{ fontFamily: geistFont, fontSize: 24, color: COLORS.textMuted }}>{contact.icon}</span>
                      <p style={{ fontFamily: geistFont, fontSize: 26, color: COLORS.textMuted, margin: 0, fontWeight: 400 }}>
                        {contact.text}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p style={{
                fontFamily: outfitFont,
                fontSize: 54,
                color: COLORS.text,
                marginTop: 65,
                fontWeight: 600,
                letterSpacing: "-1px",
                opacity: spring({ frame, fps, config: { damping: 200 }, delay: 70 }),
                transform: `translateZ(${interpolate(spring({ frame, fps, config: { damping: 200 }, delay: 70 }), [0, 1], [-40, 20])}px)`,
                textShadow: "0 6px 20px rgba(0,0,0,0.1)",
              }}>
                {PROFILE_DATA.name}
              </p>
            </div>
          </AbsoluteFill>
        </DepthLayer>
      </Camera3D>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const Introduction: React.FC = () => {
  const { fps } = useVideoConfig();
  const transitionDuration = Math.round(0.5 * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={Math.round(3 * fps)}>
          <TitleScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: transitionDuration })} />

        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <WhoIAmScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: transitionDuration })} />

        <TransitionSeries.Sequence durationInFrames={Math.round(4.5 * fps)}>
          <CurrentFocusScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: transitionDuration })} />

        <TransitionSeries.Sequence durationInFrames={Math.round(4 * fps)}>
          <ShiftScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: transitionDuration })} />

        <TransitionSeries.Sequence durationInFrames={Math.round(4 * fps)}>
          <BuildingScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: transitionDuration })} />

        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <SkillsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: transitionDuration })} />

        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <ContactScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
