"use client";

import { forwardRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { ProcessMorph, PROCESS_FRAMES } from "@/remotion/compositions/ProcessMorph";
import { FPS } from "@/remotion/brand";

// Never plays on its own: the Process section seeks it from scroll position.
const ProcessPlayer = forwardRef<PlayerRef>(function ProcessPlayer(_, ref) {
  return (
    <Player
      ref={ref}
      component={ProcessMorph}
      durationInFrames={PROCESS_FRAMES}
      fps={FPS}
      compositionWidth={1000}
      compositionHeight={1000}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      initiallyMuted
      acknowledgeRemotionLicense
    />
  );
});

export default ProcessPlayer;
