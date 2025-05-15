import { useRef, useState } from "react";
import { Score, type Frame } from "./type";

export const useBowling = ({ initialFrames }: { initialFrames: Frame[] }) => {
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(0);
  const [currentFrameStatus, setCurrentFrameStatus] = useState<
    "strike" | "spare" | null
  >(null);
  const [currentRoll, setCurrentRoll] = useState(0);
  const [currentScore, setCurrentScore] = useState<number | null>(null);

  //   const callCount = useRef(0);

  const getRandomNumber = (max: number, min: number) => {
    // callCount.current = callCount.current + 1;
    // if (callCount.current === 1) return 10;
    // if (callCount.current === 2) return 10;
    // if (callCount.current >= 3) return 3;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleRollBall = () => {
    const max =
      10 -
      (typeof frames[currentFrameNumber].score === "number"
        ? frames[currentFrameNumber].score
        : 0);

    const random = getRandomNumber(max, 0);
    const isLastRoll = currentRoll === 1;
    const isSpare =
      isLastRoll &&
      typeof frames[currentFrameNumber].score === "number" &&
      frames[currentFrameNumber].score + random === 10;
    const isStrike = !isLastRoll && random === 10;
    const isLastFrame = currentFrameNumber === 9;

    if (currentFrameStatus === "spare") {
      setFrames(
        frames.map((frame, i) => {
          if (i === currentFrameNumber - 1) {
            return { ...frame, score: 10 + random };
          }
          return frame;
        })
      );
      setCurrentFrameStatus(null);
    }

    if (
      currentFrameNumber > 0 &&
      frames[currentFrameNumber - 1].status === "strike" &&
      currentRoll !== 2
    ) {
      setFrames((prev) =>
        prev.map((frame, i) => {
          if (i === currentFrameNumber - 1) {
            return {
              ...frame,
              score:
                typeof frame.score === "number"
                  ? frame.score + random
                  : 10 + random,
            };
          }
          return frame;
        })
      );
    }

    if (
      currentFrameNumber > 1 &&
      frames[currentFrameNumber - 1].status === "strike" &&
      frames[currentFrameNumber - 2].status === "strike" &&
      currentRoll !== 2
    ) {
      setFrames((prev) =>
        prev.map((frame, i) => {
          if (i === currentFrameNumber - 2) {
            return {
              ...frame,
              score:
                typeof frame.score === "number"
                  ? frame.score + random
                  : 10 + random,
            };
          }
          return frame;
        })
      );
    }
    setCurrentScore(random);
    setFrames((prev) =>
      prev.map((frame, i) => {
        if (i === currentFrameNumber) {
          return {
            ...frame,
            rolls: frame.rolls.map((roll, index) => {
              return index === currentRoll ? random : roll;
            }),
            score: isSpare
              ? Score.Spare
              : isStrike && currentRoll !== 2
              ? Score.Strike
              : typeof frame.score === "number"
              ? frame.score + random
              : frame.score,
            status: isSpare ? "spare" : isStrike ? "strike" : null,
          };
        }

        return frame;
      })
    );

    if (isSpare) {
      setCurrentFrameStatus("spare");
    }

    if (isLastFrame && isStrike && currentRoll === 0) {
      setFrames((prev) =>
        prev.map((frame, i) => {
          if (i === currentFrameNumber) {
            return {
              ...frame,
              rolls: [10, 0, 0],
              score: random,
            };
          }
          return frame;
        })
      );
    }

    if (!isLastFrame && isStrike) {
      setCurrentFrameStatus("strike");
      setCurrentFrameNumber(currentFrameNumber + 1);
      setCurrentRoll(0);
      return;
    }
    if (
      isLastFrame &&
      currentRoll === 1 &&
      (frames[9].status === "strike" || frames[9].status === "spare")
    ) {
      setCurrentRoll(2);
      return;
    }

    if (isLastFrame && currentRoll === 2) {
      setCurrentRoll(0);
      setCurrentFrameNumber(currentFrameNumber + 1);
      return;
    }

    if (currentRoll === 1) {
      setCurrentFrameNumber(currentFrameNumber + 1);
    }
    setCurrentRoll(currentRoll === 0 ? 1 : 0);
  };

  const handleInitRollBall = () => {
    setFrames(initialFrames);
    setCurrentFrameNumber(0);
    setCurrentFrameStatus(null);
    setCurrentScore(null);
    setCurrentRoll(0);
  };

  return {
    frames,
    currentFrameStatus,
    handleRollBall,
    currentScore,
    handleInitRollBall,
    currentFrameNumber,
  };
};
