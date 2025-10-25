"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type GalleryItem = {
  /** Full-size image used in Lightbox */
  image: string;
  /** Optional thumbnail for grids/cards */
  thumb?: string;
  title: string;
  desc: string;
  tag: string;
};

type LightboxState = {
  isOpen: boolean;
  items: GalleryItem[];
  index: number;
  openWith: (items: GalleryItem[], startIndex: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
};

const LightboxCtx = createContext<LightboxState | null>(null);

export const useLightbox = () => {
  const ctx = useContext(LightboxCtx);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
};

export const LightboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [index, setIndex] = useState(0);

  const openWith = useCallback((newItems: GalleryItem[], startIndex: number) => {
    setItems(newItems);
    setIndex(startIndex);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      document.body.style.overflow = "auto";
      setItems([]);
      setIndex(0);
    }, 0);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % (items.length || 1));
  }, [items.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + (items.length || 1)) % (items.length || 1));
  }, [items.length]);

  // Keyboard navigation when open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close, next, prev]);

  const value = useMemo(
    () => ({ isOpen, items, index, openWith, close, next, prev }),
    [isOpen, items, index, openWith, close, next, prev]
  );

  return <LightboxCtx.Provider value={value}>{children}</LightboxCtx.Provider>;
};
