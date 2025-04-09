"use client";

import { useEffect, useState, useRef } from "react";
import { MakeCentsStill, PauseIcon, PlayIcon } from "../components/Icons";

import { forwardRef, useImperativeHandle } from "react";

export const MakeCentsPlayer = forwardRef(
  (
    {
      videoSrc,
      earnedAmount,
      showControls = true,
      onStart,
      onProgressUpdate,
    }: {
      videoSrc: string | undefined;
      earnedAmount: number;
      showControls: boolean;
      onStart: () => void;
      onProgressUpdate: (progress: number) => void;
    },
    ref,
  ) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const lastNotifiedProgress = useRef(0);
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      restartVideo: () => {
        const video = videoRef.current;
        if (video) {
          video.currentTime = 0;
          video.play();
          onStart();
        }
      },
    }));

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const updateProgress = () => {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);

        // Notify every 10% progress
        if (Math.floor(currentProgress / 100) > lastNotifiedProgress.current) {
          lastNotifiedProgress.current = Math.floor(currentProgress / 100);
          onProgressUpdate(currentProgress);
        }
      };

      const handlePlay = () => {
        setIsPlaying(true);
        setHasPlayed(true);
      };
      const handlePause = () => setIsPlaying(false);

      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);

      return () => {
        video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
      };
    }, [onProgressUpdate]);

    const handlePlayButtonClick = () => {
      const video = videoRef.current;
      if (video) {
        if (progress === 0) {
          onStart();
        }
        video.play();
      }
    };

    const handlePauseButtonClick = () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
      }
    };

    const resetInactivityTimeout = () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      setIsButtonVisible(true);
      inactivityTimeoutRef.current = setTimeout(() => {
        setIsButtonVisible(false);
      }, 3000);
    };

    useEffect(() => {
      const container = containerRef.current;

      if (container) {
        container.addEventListener("mousemove", resetInactivityTimeout);
        container.addEventListener("keydown", resetInactivityTimeout);
        container.addEventListener("mouseleave", () =>
          setIsButtonVisible(false),
        );
      }
      
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        if (container) {
          container.removeEventListener("mousemove", resetInactivityTimeout);
          container.removeEventListener("keydown", resetInactivityTimeout);
          container.removeEventListener("mouseleave", () =>
            setIsButtonVisible(false),
          );
        }
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return (
      <div ref={containerRef} className="md:p-[20px]">
        <div
          className={`absolute z-[1] top-0 left-0 flex h-full w-full items-center justify-center transition-opacity duration-500  ${
            (isButtonVisible && showControls) || !hasPlayed
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <div
            className="flex h-[64px] w-[64px] cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] backdrop-filter md:h-[112px] md:w-[112px]"
            onClick={isPlaying ? handlePauseButtonClick : handlePlayButtonClick}
          >
            {isPlaying && hasPlayed ? (
              <PauseIcon className="h-[30px] w-[30px] md:h-[54px] md:w-[54px]" />
            ) : (
              <PlayIcon className="h-[30px] w-[30px] md:h-[54px] md:w-[54px]" />
            )}
          </div>
        </div>
        {(!isPlaying && !hasPlayed || progress >= 100) && (
          <div className="absolute inset-0 md:p-[20px] overflow-hidden">
            <MakeCentsStill className="md:rounded-[20px] h-full w-full" />
          </div>
        )}
        <video
          ref={videoRef}
          src={videoSrc}
          controls={false}
          className="w-full rounded-[20px] shadow-lg"
        />
        {showControls && hasPlayed && (
          <div className="absolute bottom-0 w-[100%] md:bottom-[36px] md:px-[48px]">
            <div className="relative h-[12px] bg-[rgba(255,255,255,0.1)] backdrop-blur-[20px] backdrop-filter md:rounded-xl">
              <div
                className="relative h-[12px] bg-blue-500 transition-all duration-300 ease-in-out md:rounded-xl"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className={`text-grey absolute top-1/2 -translate-y-1/2 transform rounded-full border bg-white px-2 py-[1px] text-xs text-black shadow-sm`}
                style={{
                  left: isMobile && progress > 10 ? `calc(${progress}% - 50px)` : `${progress}%`,
                  transform: !isMobile ? "translate(-50%, -50%)" : "",
                }}
              >
                ${earnedAmount.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

MakeCentsPlayer.displayName = "MakeCentsPlayer";
