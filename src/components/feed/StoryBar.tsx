"use client";

import { useRef } from "react";
import Image from "next/image";

const stories = [
  { name: "Ryan Roslansky", cardImg: "/assets/images/card_ppl2.png", mobileImg: "/assets/images/mobile_story_img1.png", miniImg: "/assets/images/mini_pic.png" },
  { name: "Ryan Roslansky", cardImg: "/assets/images/card_ppl3.png", mobileImg: "/assets/images/mobile_story_img2.png", miniImg: "/assets/images/mini_pic.png" },
  { name: "Ryan Roslansky", cardImg: "/assets/images/card_ppl4.png", mobileImg: "/assets/images/mobile_story_img1.png", miniImg: "/assets/images/mini_pic.png" },
];

export default function StoryBar() {
  const mobileScrollRef = useRef<HTMLUListElement>(null);

  return (
    <>
      {/* Desktop Stories — card grid */}
      <div className="relative mb-4 hidden md:block">
        <div className="grid grid-cols-4 gap-2.5">
          {/* Your Story */}
          <div className="relative h-[200px] overflow-hidden rounded-[6px]">
            <Image
              src="/assets/images/card_ppl1.png"
              alt="Your Story"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center">
              <button className="mb-1.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                  <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                </svg>
              </button>
              <p className="text-xs font-medium text-white">Your Story</p>
            </div>
          </div>

          {/* Other stories */}
          {stories.map((story, i) => (
            <div key={i} className="relative h-[200px] cursor-pointer overflow-hidden rounded-[6px]">
              <Image
                src={story.cardImg}
                alt={story.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <p className="text-xs font-medium text-white">{story.name}</p>
              </div>
              <div className="absolute left-2.5 top-2.5">
                <div className="h-[30px] w-[30px] overflow-hidden rounded-full border-2 border-primary">
                  <Image
                    src={story.miniImg}
                    alt=""
                    width={30}
                    height={30}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow button */}
        <button className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary/80 text-white transition-colors hover:bg-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
            <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
          </svg>
        </button>
      </div>

      {/* Mobile Stories — horizontal scroll circles */}
      <div className="mb-4 block md:hidden">
        <ul
          ref={mobileScrollRef}
          className="flex gap-3 overflow-x-auto px-1 py-2"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Your Story */}
          <li className="flex flex-shrink-0 flex-col items-center">
            <a href="#" className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="h-[56px] w-[56px] overflow-hidden rounded-full">
                  <Image
                    src="/assets/images/mobile_story_img.png"
                    alt="Your Story"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                  </svg>
                </div>
              </div>
              <p className="text-[11px] text-text-muted">Your Story</p>
            </a>
          </li>

          {/* Other stories */}
          {stories.map((story, i) => (
            <li key={i} className="flex flex-shrink-0 flex-col items-center">
              <a href="#" className="flex flex-col items-center">
                <div className={`mb-1 rounded-full p-[2px] ${i % 2 === 0 ? "bg-gradient-to-tr from-primary to-accent" : "border-2 border-border-light"}`}>
                  <div className="h-[52px] w-[52px] overflow-hidden rounded-full border-2 border-[var(--card-bg)]">
                    <Image
                      src={story.mobileImg}
                      alt={story.name}
                      width={52}
                      height={52}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <p className="w-[60px] truncate text-center text-[11px] text-text-muted">
                  {story.name.split(" ")[0]}...
                </p>
              </a>
            </li>
          ))}

          {/* Duplicate for scroll */}
          {stories.map((story, i) => (
            <li key={`dup-${i}`} className="flex flex-shrink-0 flex-col items-center">
              <a href="#" className="flex flex-col items-center">
                <div className={`mb-1 rounded-full p-[2px] ${i % 2 === 0 ? "border-2 border-border-light" : "bg-gradient-to-tr from-primary to-accent"}`}>
                  <div className="h-[52px] w-[52px] overflow-hidden rounded-full border-2 border-[var(--card-bg)]">
                    <Image
                      src={story.mobileImg}
                      alt={story.name}
                      width={52}
                      height={52}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <p className="w-[60px] truncate text-center text-[11px] text-text-muted">
                  {story.name.split(" ")[0]}...
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
