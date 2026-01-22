import { Composition } from "remotion";
import { Introduction } from "./Introduction";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Introduction"
        component={Introduction}
        durationInFrames={1740}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
