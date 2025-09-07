import { getTodaysMood } from "../../lib/database";
import MoodSelector from "./MoodSelector";

export const MoodSelectorWrapper = async ({
  editing,
}: {
  editing: boolean;
}) => {
  let editedEntry;
  if (editing) {
    const { entry, error } = await getTodaysMood();
    if (!entry || error) {
      throw error || "Could not get today's mood";
    }
    editedEntry = {
      valence: entry.valence,
      arousal: entry.arousal,
      note: entry.note || undefined,
    };
  }
  return <MoodSelector editedEntry={editedEntry} />;
};

export default MoodSelectorWrapper;
