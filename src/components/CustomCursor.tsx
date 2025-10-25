"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current!;
    const follower = followerRef.current!;
    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      window.setTimeout(() => {
        follower.style.left = `${e.clientX}px`;
        follower.style.top = `${e.clientY}px`;
      }, 100);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName.toLowerCase();
      setHovering(tag === "a" || tag === "button");
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={`${styles.cursor} ${hovering ? styles.cursorHover : ""}`} />
      <div ref={followerRef} className={styles.cursorFollower} />
    </>
  );
};

export default CustomCursor;
