"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "User";

  return (
    <nav className="fixed left-0 right-0 top-0 z-[1030] bg-[var(--card-bg)] transition-all duration-200">
      <div className="mx-auto flex h-[70px] max-w-[1320px] items-center px-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/feed">
            <Image
              src="/assets/images/logo.svg"
              alt="Buddy Script"
              width={130}
              height={32}
              className="h-auto w-auto"
              priority
            />
          </Link>
        </div>

        {/* Search */}
        <div className="ml-auto hidden md:block">
          <div className="relative">
            <svg
              className="absolute left-[18px] top-3 text-text-muted"
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
              className="h-[42px] w-[280px] rounded-pill border border-border-input bg-[var(--input-bg)] pl-11 pr-4 text-sm text-text-body outline-none placeholder:text-text-muted focus:border-primary dark:text-white"
            />
          </div>
        </div>

        {/* Nav Icons */}
        <ul className="ml-auto mr-2 hidden items-center lg:flex">
          {/* Home */}
          <li className="mx-3">
            <Link
              href="/feed"
              className="relative block px-4 py-[22px] transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-t after:bg-primary after:content-['']"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
                <path className="stroke-primary" strokeWidth="1.5" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                <path className="stroke-primary" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" />
              </svg>
            </Link>
          </li>
          {/* Friends */}
          <li className="mx-3">
            <span className="relative block cursor-pointer px-4 py-[22px] opacity-60 transition-all duration-200 hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" fill="none" viewBox="0 0 26 20">
                <path fill="currentColor" fillRule="evenodd" d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75z" clipRule="evenodd" />
              </svg>
            </span>
          </li>
          {/* Notifications */}
          <li className="mx-3">
            <span className="relative block cursor-pointer px-4 py-[22px] opacity-60 transition-all duration-200 hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none" viewBox="0 0 20 22">
                <path fill="currentColor" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
              </svg>
            </span>
          </li>
          {/* Messages */}
          <li className="mx-3">
            <span className="relative block cursor-pointer px-4 py-[22px] opacity-60 transition-all duration-200 hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 23 22">
                <path fill="currentColor" fillRule="evenodd" d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z" clipRule="evenodd" />
              </svg>
            </span>
          </li>
        </ul>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0px_4px_13px_rgba(24,144,255,0.1)] transition-all duration-200 dark:bg-dark-secondary"
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)" />
              <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
              <path fill="#112032" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z" />
            </svg>
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative ml-4" ref={dropdownRef}>
          <div className="flex cursor-pointer items-center gap-2" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="h-[38px] w-[38px] overflow-hidden rounded-full">
              <Image
                src={user?.avatarUrl || "/assets/images/profile.png"}
                alt="Profile"
                width={38}
                height={38}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden items-center gap-1 lg:flex">
              <p className="text-sm font-medium text-text-heading dark:text-white">{displayName}</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6" className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}>
                <path fill="currentColor" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
              </svg>
            </div>
          </div>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-[280px] rounded-sm bg-[var(--card-bg)] p-4 shadow-[var(--dropdown-shadow)]">
              <div className="mb-3 flex items-center gap-3 border-b border-border-input pb-3">
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={user?.avatarUrl || "/assets/images/profile.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text-heading dark:text-white">{displayName}</h4>
                  <p className="text-xs text-primary">View Profile</p>
                </div>
              </div>
              <ul className="space-y-1">
                <li>
                  <button className="flex w-full items-center gap-3 rounded px-2 py-2 text-sm text-text-muted transition-colors hover:bg-surface-input dark:text-white/70 dark:hover:bg-dark-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19"><path fill="#377DFF" d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17zm-.58 6.395c-1.744 0-3.16 1.39-3.16 3.105s1.416 3.105 3.16 3.105c1.746 0 3.161-1.39 3.161-3.105s-1.415-3.105-3.16-3.105z" /></svg>
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setProfileOpen(false); logout(); }}
                    className="flex w-full items-center gap-3 rounded px-2 py-2 text-sm text-text-muted transition-colors hover:bg-surface-input dark:text-white/70 dark:hover:bg-dark-secondary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19"><path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667" /></svg>
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
