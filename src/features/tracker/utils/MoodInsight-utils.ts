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
