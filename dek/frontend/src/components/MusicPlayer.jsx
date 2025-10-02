import React from "react";
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import albumArt from "../images/kendrick-gnx.jpg";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(75);
  const [isShuffled, setIsShuffled] = React.useState(false);
  const [isRepeating, setIsRepeating] = React.useState(false);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral-800 text-white px-2 py-2 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Album Cover + Song Title + Artists */}
        <div className="flex items-center space-x-3 w-1/4">
          <img
            src={albumArt}
            alt="Album Art"
            className="w-12 h-12 rounded-md"
          />
          <div>
            <h3 className="font-semibold text-base">luther</h3>
            <p className="text-neutral-400 text-xs">Kendrick Lamar</p>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center space-y-1 flex-grow">
          {/* Control Buttons */}
          <div className="flex items-center space-x-5">
            {/* 5. Shuffle Button Added */}
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`${
                isShuffled ? "text-red-500" : "text-neutral-400"
              } hover:text-white transition-colors`}
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
            </button>

            <button className="text-neutral-400 hover:text-white transition-colors">
              <BackwardIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>
            <button className="text-neutral-400 hover:text-white transition-colors">
              <ForwardIcon className="h-6 w-6" />
            </button>

            {/* 6. Repeat Button Added */}
            <button
              onClick={() => setIsRepeating(!isRepeating)}
              className={`${
                isRepeating ? "text-red-500" : "text-neutral-400"
              } hover:text-white transition-colors`}
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full max-w-xl">
            <span className="text-xs text-neutral-400">1:24</span>
            <div className="w-full bg-neutral-600 rounded-full h-1.5">
              <div
                className="bg-white h-1.5 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
            <span className="text-xs text-neutral-400">3:56</span>
          </div>
        </div>

        {/* Right Side: Volume Controls */}

        <div className="w-1/4 flex items-center justify-end gap-2">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 75)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            {volume > 0 ? (
              <SpeakerWaveIcon className="h-5 w-5" />
            ) : (
              <SpeakerXMarkIcon className="h-5 w-5" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-24 h-1.5 bg-neutral-600 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
