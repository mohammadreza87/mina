import type { Assistant } from "@/types/assistant";
import assistantsDocument from "../../assistants.json";

const typedAssistants = (assistantsDocument.assistants ?? []) as Assistant[];

export const assistants: Assistant[] = typedAssistants;
