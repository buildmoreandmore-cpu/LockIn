
import { GoogleGenAI } from "@google/genai";
import { TrainerLevel } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const getPersonaInstruction = (level: TrainerLevel) => {
  switch (level) {
    case TrainerLevel.RECRUIT:
      return "You are a tough but encouraging coach. The user is new. Build their confidence, but set high standards. Be firm but fair.";
    case TrainerLevel.SOLDIER:
      return "You are a strict drill sergeant. The user knows the drill. Call out their patterns. Expect consistency. No coddling.";
    case TrainerLevel.WARRIOR:
      return "You are 'The Savage'. Brutally honest. Maximum accountability. No excuses accepted. If they falter, crush their ego to rebuild it.";
    case TrainerLevel.COMMANDER:
      return "You are a wise, hardened mentor. You know when to push and when to protect. Speak with absolute authority and wisdom.";
    default:
      return "You are a disciplined gym trainer for the mind.";
  }
};

export const getFocusMotivation = async (taskName: string, level: TrainerLevel, phase: 'START' | 'MIDDLE' | 'END'): Promise<string> => {
  const ai = getClient();
  const defaultMsg = phase === 'START' ? "Eyes forward. Execute." : "Finish strong.";

  if (!ai) return defaultMsg;

  let phaseContext = "";
  if (phase === 'START') phaseContext = "The session is just starting. Set the tone.";
  if (phase === 'MIDDLE') phaseContext = "We are in the thick of it (The Grind). Keep them moving.";
  if (phase === 'END') phaseContext = "We are close to the finish. Demand a strong finish.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      ${getPersonaInstruction(level)}
      User is working on: "${taskName}".
      Context: ${phaseContext}
      Task: Give a single, punchy command (under 15 words).
      Tone: Intense, stoic, military.
      `,
    });
    return response.text?.trim() ?? defaultMsg;
  } catch (error) {
    console.error("Gemini Error:", error);
    return defaultMsg;
  }
};

export const getExitIntervention = async (timeLeftMinutes: number, level: TrainerLevel): Promise<string> => {
    const ai = getClient();
    const defaultMsg = "You said you wanted this. Prove it.";

    if (!ai) return defaultMsg;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
            ${getPersonaInstruction(level)}
            The user is trying to quit with ${timeLeftMinutes} minutes left.
            Task: Guilt-trip them into staying (without being abusive). Use psychological leverage.
            Length: 2 short sentences max.
            `,
        });
        return response.text?.trim() ?? defaultMsg;
    } catch (error) {
        return defaultMsg;
    }
}

export const getExitReflection = async (taskName: string, reason: string, level: TrainerLevel): Promise<string> => {
  const ai = getClient();
  const defaultMsg = "Excuses are lies we tell ourselves. Reset and execute.";

  if (!ai) return defaultMsg;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      ${getPersonaInstruction(level)}
      User quit "${taskName}" early because: "${reason}".
      Analyze this excuse. Be harsh but truthful.
      Length: 1 sentence.
      `,
    });
    return response.text?.trim() ?? defaultMsg;
  } catch (error) {
    console.error("Gemini Error:", error);
    return defaultMsg;
  }
};
