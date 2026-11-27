"use client";
import { useSyncExternalStore } from "react";
const subscribeStatic = () => () => {};
const serverFalse = () => false;
const unsupportedObserver = () => !("IntersectionObserver" in window);
function subscribeMotion(notify: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
const motionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export function useObserverFallback() {
  return useSyncExternalStore(subscribeStatic, unsupportedObserver, serverFalse);
}
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribeMotion, motionSnapshot, serverFalse);
}
