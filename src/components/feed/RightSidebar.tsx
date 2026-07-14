"use client";

import Image from "next/image";

const youMightLike = [
  { name: "Radovan SkillArena", role: "Founder & CEO at Trophy", img: "/assets/images/Avatar.png" },
];

const friends = [
  { name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png", online: false, lastSeen: "5 minute ago" },
  { name: "Ryan Roslansky", role: "CEO of Linkedin", img: "/assets/images/people2.png", online: true },
  { name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png", online: true },
  { name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png", online: false, lastSeen: "5 minute ago" },
  { name: "Ryan Roslansky", role: "CEO of Linkedin", img: "/assets/images/people2.png", online: true },
  { name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png", online: true },
  { name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png", online: true },
  { name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png", online: false, lastSeen: "5 minute ago" },
];

export default function RightSidebar() {
  return (
    <aside className="hidden flex-col overflow-auto pt-[18px] lg:flex" style={{ height: "calc(100vh - 70px)" }}>
      {/* You Might Like */}
      <div className="mb-4 rounded-sm bg-[var(--card-bg)] p-6 transition-all duration-200">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-lg font-medium text-text-heading">You Might Like</h4>
          <span className="cursor-pointer text-xs font-medium text-primary">See All</span>
        </div>
        <hr className="mb-4 border-border-input" />
        {youMightLike.map((person) => (
          <div key={person.name}>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <Image src={person.img} alt={person.name} width={40} height={40} className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-heading">{person.name}</h4>
                <p className="text-xs text-text-muted">{person.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-[2px] border border-[#DCDFE4] py-[7px] text-xs font-medium text-[#959EAE] transition-colors hover:border-primary hover:text-primary">
                Ignore
              </button>
              <button className="flex-1 rounded-[2px] bg-primary py-[7px] text-xs font-medium text-white transition-colors hover:bg-primary-hover">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Your Friends */}
      <div className="mb-4 rounded-sm bg-[var(--card-bg)] p-6 pb-1.5 transition-all duration-200">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-lg font-medium text-text-heading">Your Friends</h4>
          <span className="cursor-pointer text-xs font-medium text-primary">See All</span>
        </div>
        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-[10px] text-text-muted"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            fill="none"
            viewBox="0 0 17 17"
          >
            <circle cx="7" cy="7" r="6" stroke="currentColor" />
            <path stroke="currentColor" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
          <input
            type="search"
            placeholder="Search..."
            className="h-[38px] w-full rounded-sm border border-border-input bg-[var(--input-bg)] pl-10 pr-3 text-sm text-text-body outline-none placeholder:text-text-muted focus:border-primary"
          />
        </div>
        {/* Friends list */}
        <div className="max-h-[400px] overflow-auto">
          {friends.map((friend, i) => (
            <div
              key={i}
              className={`mb-4 flex cursor-pointer items-center justify-between rounded-sm p-2 transition-colors hover:bg-surface-input ${!friend.online ? "opacity-60" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-[38px] w-[38px] overflow-hidden rounded-full">
                  <Image src={friend.img} alt={friend.name} width={38} height={38} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text-heading">{friend.name}</h4>
                  <p className="text-xs text-text-muted">{friend.role}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {friend.online ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                    <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                  </svg>
                ) : (
                  <span className="text-[11px] text-text-muted">{friend.lastSeen}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
