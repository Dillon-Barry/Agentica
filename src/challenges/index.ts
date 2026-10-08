import type { Challenge } from "./kit";
import { sortIt } from "./sort";
import { beTheLoop } from "./loop";
import { readTheLabel } from "./label";
import { assignTheParty } from "./party";
import { breakTheTrifecta } from "./trifecta";
import { writeTheGateRule } from "./gate";
import { lockTheSandbox } from "./sandbox";

/** One hands-on challenge per world, keyed by world number. */
export const CHALLENGES: Record<number, Challenge> = {
  1: sortIt,
  2: beTheLoop,
  3: readTheLabel,
  4: assignTheParty,
  5: breakTheTrifecta,
  6: writeTheGateRule,
  7: lockTheSandbox,
};
