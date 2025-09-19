//Maps valence (-5 to 5) and arousal (-5 to 5) into a human-readable mood.
export function getMoodFromValenceArousal(
  valence: number,
  arousal: number
): string {
  // Thresholds for high/low separation
  const highValence = 2;
  const lowValence = -2;
  const highArousal = 2;
  const lowArousal = -2;

  if (valence >= highValence && arousal >= highArousal)
    return "excited / energized";
  if (valence >= highValence && arousal <= lowArousal)
    return "peaceful / relaxed";
  if (valence <= lowValence && arousal >= highArousal) return "anxious / angry";
  if (valence <= lowValence && arousal <= lowArousal) return "sad / low";

  // Neutral or mixed cases
  if (Math.abs(valence) <= 1 && Math.abs(arousal) <= 1) return "neutral";
  if (valence >= highValence) return "content";
  if (valence <= lowValence) return "unpleasant";
  if (arousal >= highArousal) return "alert";
  if (arousal <= lowArousal) return "tired";

  return "mixed / ambiguous";
}

export function getInsights(
  entries: { day: Date; valence: number; arousal: number }[]
) {
  // Helper to get majority (returns null if tie)
  const getMajority = (arr: string[]) => {
    if (!arr.length) return null;

    const counts: Record<string, number> = {};
    arr.forEach((val) => (counts[val] = (counts[val] || 0) + 1));

    let max = 0;
    let majority: string | null = null;
    let isTie = false;

    for (const key in counts) {
      if (counts[key] > max) {
        max = counts[key];
        majority = key;
        isTie = false; // reset tie flag since we found a new max
      } else if (counts[key] === max) {
        isTie = true;
      }
    }

    return isTie ? null : majority;
  };

  // Map moods for all entries
  const moods = entries.map((e) =>
    getMoodFromValenceArousal(e.valence, e.arousal)
  );

  // Separate weekdays and weekends
  const weekdays = entries
    .filter((e) => [1, 2, 3, 4, 5].includes(e.day.getDay()))
    .map((e) => getMoodFromValenceArousal(e.valence, e.arousal));

  const weekends = entries
    .filter((e) => [0, 6].includes(e.day.getDay()))
    .map((e) => getMoodFromValenceArousal(e.valence, e.arousal));

  // Most common moods
  const overallMood = getMajority(moods);
  const weekdayMood = getMajority(weekdays);
  const weekendMood = getMajority(weekends);

  const MIN_REQUIRED_VALUE_THRESHOLD = 0;

  // High/low valence majority
  const highValenceCount = entries.filter(
    (e) => e.valence > MIN_REQUIRED_VALUE_THRESHOLD
  ).length;
  const lowValenceCount = entries.filter(
    (e) => e.valence < -MIN_REQUIRED_VALUE_THRESHOLD
  ).length;
  const highArousalCount = entries.filter(
    (e) => e.arousal > MIN_REQUIRED_VALUE_THRESHOLD
  ).length;
  const lowArousalCount = entries.filter(
    (e) => e.arousal < -MIN_REQUIRED_VALUE_THRESHOLD
  ).length;

  const valenceInsight =
    highValenceCount > lowValenceCount
      ? "Your valence was mostly high."
      : lowValenceCount > highValenceCount
      ? "Your valence was mostly low."
      : null;

  const arousalInsight =
    highArousalCount > lowArousalCount
      ? "Your arousal was mostly high."
      : lowArousalCount > highArousalCount
      ? "Your arousal was mostly low."
      : null;

  // Build final insights array
  const insights: string[] = [];

  if (overallMood) insights.push(`Most of your moods were "${overallMood}".`);
  if (weekdayMood) insights.push(`Weekdays were mostly "${weekdayMood}".`);
  if (weekendMood) insights.push(`Weekends were mostly "${weekendMood}".`);
  if (valenceInsight) insights.push(valenceInsight);
  if (arousalInsight) insights.push(arousalInsight);
  return insights;
}
