import { useState } from "react";

enum Score {
  Strike = "X",
  Spare = "/",
}

export default function App() {
  const initialFrames: {
    score: Score | number;
    rolls: (string | number)[];
    status: "strike" | "spare" | null;
  }[] = Array.from({ length: 10 }, () => ({
    score: 0,
    rolls: ["X", "X"],
    status: null,
  }));

  const [frames, setFrames] = useState(initialFrames);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(0);
  const [currentFrameStatus, setCurrentFrameStatus] = useState<
    "strike" | "spare" | null
  >(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [currentRoll, setCurrentRoll] = useState(0);

  // 마지막 큐일 때는 스트라이크일 때 계속
  // 스트라이크일 때 score 계산

  const rollBall = () => {
    const min = 0;
    const max =
      10 -
      (typeof frames[currentFrameNumber].score === "number"
        ? frames[currentFrameNumber].score
        : 0);

    const random = Math.floor(Math.random() * (max - min + 1)) + min;
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
      currentRoll === 0
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

  return (
    <main className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-4xl font-bold">웹 볼링 게임</h1>
      <div className="bg-white p-3 rounded-lg mb-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {frames.map((frame, i) => (
                <th
                  key={`${frame.score}-${i}`}
                  className="border p-2 text-center w-20"
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {frames.map((frame, i) => (
                <td key={String(frame)} className="border p-0 text-center">
                  <div className="flex flex-wrap">
                    {i < 9 ? (
                      <>
                        <div className="w-1/2 border-r border-b p-2">
                          {frame.rolls[0]}
                        </div>
                        <div className="w-1/2 border-b p-2">
                          {frame.rolls[1]}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={`border-r border-b p-2 ${
                            frame.rolls[2] === undefined ? "w-1/2" : "w-1/3"
                          }`}
                        >
                          {frame.rolls[0]}
                        </div>
                        <div
                          className={`border-b p-2 ${
                            frame.rolls[2] === undefined
                              ? "w-1/2"
                              : "w-1/3 border-r"
                          }`}
                        >
                          {frame.rolls[1]}
                        </div>
                        {frame.rolls[2] !== undefined && (
                          <div className="w-1/3 border-b p-2">
                            {frame.rolls[2]}
                          </div>
                        )}
                      </>
                    )}
                    <div className="w-full p-2 font-bold flex flex-col">
                      <span>{frame.score}</span>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <span className="text-2xl font-bold mr-4">
          총점:
          {frames.reduce(
            (acc, frame) =>
              acc + (typeof frame.score === "number" ? frame.score : 0),
            0
          )}
        </span>
        <button
          type="button"
          className="py-3 px-6 rounded-lg text-white font-bold text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          onClick={rollBall}
          disabled={currentFrameNumber === 10}
        >
          볼링공 굴리기
        </button>
        <button
          type="button"
          className="ml-4 py-3 px-6 rounded-lg text-white font-bold text-lg bg-black disabled:opacity-50"
          onClick={() => {
            setFrames(initialFrames);
            setCurrentFrameNumber(0);
            setCurrentFrameStatus(null);
            setCurrentScore(null);
            setCurrentRoll(0);
          }}
        >
          초기화
        </button>
        <div className="text-6xl font-bold mb-8 h-20 flex items-center justify-center">
          {currentScore !== null ? currentScore : "-"}
        </div>
        <div className="text-6xl font-bold mb-8 h-20 flex items-center justify-center">
          {currentFrameStatus ? `${currentFrameStatus}입니다.` : "-"}
        </div>
      </div>
    </main>
  );
}
