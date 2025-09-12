"use client";
import { useEffect } from "react";
import { seedIfEmpty } from "../lib/storage";

export default function SeedOnMount() {
  useEffect(() => {
    seedIfEmpty();
  }, []);
  return null;
}
