import { createContext, useState, useContext, useEffect } from "react";

const CDContext = createContext();

export const useCDContext  = () => useContext(CDContext);

export const CDProvider = () => {}