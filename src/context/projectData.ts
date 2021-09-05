import { IProjectData } from "@/utils/initProjectData";
import React from "react";

export type ProjectContext = IProjectData | null;

export const projectContext = React.createContext<ProjectContext>(null);
