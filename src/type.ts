export enum Score {
  Strike = "X",
  Spare = "/",
}

export interface Frame {
  score: Score | number;
  rolls: (string | number)[];
  status: "strike" | "spare" | null;
}
