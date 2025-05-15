import { describe, it, expect, vi } from "vitest";
import { useBowling } from "./hooks";
import { act, renderHook } from "@testing-library/react";
import { Score } from "./type";

describe("볼링게임!", () => {
  it("useBowling 함수 존재", () => {
    expect(useBowling).toBeInstanceOf(Function);
  });

  it("스트라이크가 아닌 경우 2번 던지면 프레임 증가", async () => {
    const initialFrames = Array.from({ length: 10 }, () => ({
      score: 0,
      rolls: ["X", "X"],
      status: null,
    }));
    const { result } = renderHook(() => useBowling({ initialFrames }));

    await act(async () => {
      await result.current.handleRollBall();
    });
    await act(async () => {
      await result.current.handleRollBall();
    });

    expect(result.current.currentFrameNumber).toBeGreaterThanOrEqual(1);
  });

  it("스트라이크가 아닌 경우 2번 던지면 스코어 계산 및 프레임 증가", async () => {
    const initialFrames = Array.from({ length: 10 }, () => ({
      score: 0,
      rolls: ["X", "X"],
      status: null,
    }));

    const mathRandomSpy = vi.spyOn(Math, "floor");
    mathRandomSpy.mockReturnValue(3);
    const { result } = renderHook(() => useBowling({ initialFrames }));

    await act(async () => {
      await result.current.handleRollBall();
    });

    await act(async () => {
      await result.current.handleRollBall();
    });

    expect(result.current.frames[0].score).toBe(6);
    expect(result.current.currentFrameNumber).toBe(1);
  });

  it("처음에 모든 pin을 칠 경우 스트라이크", async () => {
    const initialFrames = Array.from({ length: 10 }, () => ({
      score: 0,
      rolls: ["X", "X"],
      status: null,
    }));

    const mathRandomSpy = vi.spyOn(Math, "floor");
    mathRandomSpy.mockReturnValue(10);

    const { result } = renderHook(() => useBowling({ initialFrames }));

    await act(async () => {
      await result.current.handleRollBall();
    });
    await act(async () => {
      await result.current.handleRollBall();
    });

    expect(result.current.frames[0].rolls[0]).toBe(10);
    expect(result.current.frames[0].rolls[1]).toBe("X");
    expect(result.current.frames[0].status).toBe("strike");

    mathRandomSpy.mockRestore();
  });

  it("2번 던지고, 합이 10일 경우 스페어", async () => {
    const initialFrames = Array.from({ length: 10 }, () => ({
      score: 0,
      rolls: ["X", "X"],
      status: null,
    }));

    const mathRandomSpy = vi.spyOn(Math, "floor");
    mathRandomSpy.mockReturnValue(5);

    const { result } = renderHook(() => useBowling({ initialFrames }));

    await act(async () => {
      await result.current.handleRollBall();
    });

    await act(async () => {
      await result.current.handleRollBall();
    });

    expect(result.current.frames[0].rolls[0]).toBe(5);
    expect(result.current.frames[0].rolls[1]).toBe(5);
    expect(result.current.frames[0].status).toBe("spare");

    mathRandomSpy.mockRestore();
  });

  it("스트라이크를 하면 현재 스코어는 X가 된다.", async () => {
    const initialFrames = Array.from({ length: 10 }, () => ({
      score: 0,
      rolls: ["X", "X"],
      status: null,
    }));

    const { result } = renderHook(() => useBowling({ initialFrames }));

    const mathRandomSpy = vi.spyOn(Math, "floor");
    mathRandomSpy.mockReturnValue(10);

    await act(async () => {
      await result.current.handleRollBall();
    });

    console.log(result.current.frames);

    expect(result.current.frames[0].rolls[0]).toBe(10);
    expect(result.current.frames[0].score).toBe(Score.Strike);
    expect(result.current.frames[0].status).toBe("strike");

    mathRandomSpy.mockRestore();
  });

  it("스트라이크 후에 현재 스코어는 다음 스코어의 합이 이전 스트라이크 스코어에 더해진다.", async () => {
    const initialFrames = Array.from({ length: 10 }, () => ({
      score: 0,
      rolls: ["X", "X"],
      status: null,
    }));
    const { result } = renderHook(() => useBowling({ initialFrames }));

    const mathRandomSpy = vi.spyOn(Math, "floor");

    mathRandomSpy.mockReturnValue(10);
    await act(async () => {
      await result.current.handleRollBall();
    });
    mathRandomSpy.mockRestore();

    mathRandomSpy.mockReturnValue(3);
    await act(async () => {
      await result.current.handleRollBall();
    });
    await act(async () => {
      await result.current.handleRollBall();
    });

    expect(result.current.frames[0].score).toBe(16);
    expect(result.current.frames[1].score).toBe(6);

    mathRandomSpy.mockRestore();
  });

  it("연속 2번 스트라이크를 던지면 스코어는 20 더하기 다음 프레임의 스코어의 합이 된다.", async () => {
    const initialFrames = Array.from({ length: 10 }, () => ({
      score: 0,
      rolls: ["X", "X"],
      status: null,
    }));

    const mathRandomSpy = vi.spyOn(Math, "floor");
    mathRandomSpy.mockReturnValue(10);

    const { result } = renderHook(() => useBowling({ initialFrames }));

    await act(async () => {
      await result.current.handleRollBall();
    });

    await act(async () => {
      await result.current.handleRollBall();
    });

    mathRandomSpy.mockRestore();

    mathRandomSpy.mockReturnValue(3);
    await act(async () => {
      await result.current.handleRollBall();
    });
    await act(async () => {
      await result.current.handleRollBall();
    });

    console.log(result.current.frames);

    expect(result.current.frames[0].score).toBe(26);
    expect(result.current.frames[1].score).toBe(16);
    expect(result.current.frames[2].score).toBe(6);

    mathRandomSpy.mockRestore();
  });

  it("스트라이크를 연속 4번 칠 경우 최대 스코어는 40이 아닌 30이 된다.", async () => {
    const initialFrames = Array.from({ length: 10 }, () => ({
      score: 0,
      rolls: ["X", "X"],
      status: null,
    }));

    const mathRandomSpy = vi.spyOn(Math, "floor");
    mathRandomSpy.mockReturnValue(10);

    const { result } = renderHook(() => useBowling({ initialFrames }));

    await act(async () => {
      await result.current.handleRollBall();
    });

    await act(async () => {
      await result.current.handleRollBall();
    });

    await act(async () => {
      await result.current.handleRollBall();
    });

    await act(async () => {
      await result.current.handleRollBall();
    });

    expect(result.current.frames[0].score).toBe(30);
    expect(result.current.frames[1].score).toBe(30);
    expect(result.current.frames[2].score).toBe(20);
    expect(result.current.frames[3].score).toBe(Score.Strike);

    mathRandomSpy.mockRestore();
  });
});
