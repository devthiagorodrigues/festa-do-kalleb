"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * prefers-reduced-motion sem hydration mismatch: no servidor e no primeiro render do
 * cliente retorna false; depois de montar, reflete a preferência do usuário.
 */
export function useCalmMotion(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}
