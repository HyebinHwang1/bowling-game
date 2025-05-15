import type { Frame } from "./type";
import { useBowling } from "./hooks";

export default function App() {
  const initialFrames: Frame[] = Array.from({ length: 10 }, () => ({
    score: 0,
    rolls: ["X", "X"],
    status: null,
  }));

  const {
    frames,
    currentFrameStatus,
    handleRollBall,
    currentScore,
    handleInitRollBall,
    currentFrameNumber,
  } = useBowling({ initialFrames });

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
          onClick={handleRollBall}
          disabled={currentFrameNumber === 10}
        >
          볼링공 굴리기
        </button>
        <button
          type="button"
          className="ml-4 py-3 px-6 rounded-lg text-white font-bold text-lg bg-black disabled:opacity-50"
          onClick={handleInitRollBall}
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
