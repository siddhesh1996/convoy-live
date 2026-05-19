import type { PairDistance, PositionsMap } from "../types/position";
import { distanceBetween } from "./distanceBetween";

export function computePairDistances(positions: PositionsMap): PairDistance[] {
  const ids = Object.keys(positions);
  const results: PairDistance[] = [];

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = positions[ids[i]];
      const b = positions[ids[j]];

      if (
        a?.latitude == null ||
        a?.longitude == null ||
        b?.latitude == null ||
        b?.longitude == null
      ) {
        continue;
      }

      results.push({
        userA: ids[i],
        userB: ids[j],
        meters: Math.round(
          distanceBetween(
            a.latitude,
            a.longitude,
            b.latitude,
            b.longitude,
            "m",
          ),
        ),
        km: Number(
          distanceBetween(
            a.latitude,
            a.longitude,
            b.latitude,
            b.longitude,
            "km",
          ).toFixed(2),
        ),
        miles: Number(
          distanceBetween(
            a.latitude,
            a.longitude,
            b.latitude,
            b.longitude,
            "mi",
          ).toFixed(2),
        ),
      });
    }
  }

  return results;
}

export function distancesFromMe(
  myId: string,
  positions: PositionsMap,
): Record<string, PairDistance["meters"]> {
  const me = positions[myId];
  if (!me) return {};

  return Object.fromEntries(
    Object.keys(positions)
      .filter((id) => id !== myId)
      .map((id) => {
        const other = positions[id];
        return [
          id,
          Math.round(
            distanceBetween(
              me.latitude,
              me.longitude,
              other.latitude,
              other.longitude,
              "m",
            ),
          ),
        ];
      }),
  );
}
