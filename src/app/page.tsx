// app/page.tsx 或 pages/index.tsx
"use client";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-lg">
        <div className="text-2xl font-extrabold tracking-tight text-white drop-shadow">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400">
            FileFlow
          </span>
        </div>
        <nav>
          <a
            href="dashboard/apps/new"
            className="text-white/90 hover:text-yellow-300 font-medium mr-8 transition"
          >
            Docs
          </a>
          <a
            href="dashboard/apps/new"
            className="text-white/90 hover:text-yellow-300 font-medium transition"
          >
            Dashboard
          </a>
        </nav>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-5xl">
          {/* 左侧文案 */}
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 drop-shadow">
              Upload files <br />{" "}
              <span className="text-white">with style & safety</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              让开发者和用户都爱上的文件上传体验。多端支持，安全合规，极致美观。
              <br />
              轻松集成，极速上手，支持多种格式和大文件。
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="dashboard/apps"
                className="bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 hover:scale-105 transition-transform text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-pink-200/30"
              >
                免费开始
              </a>
              <a
                href="dashboard/apps/new"
                className="border border-white/60 hover:bg-white/10 text-white font-semibold px-7 py-3 rounded-xl transition"
              >
                查看文档 →
              </a>
            </div>
          </div>
          {/* 右侧 SVG 插画 */}
          <div className="flex-shrink-0 mt-12 md:mt-0 animate-float">
            <svg width="340" height="260" viewBox="0 0 340 260" fill="none">
              {/* 云朵 */}
              <ellipse cx="170" cy="140" rx="120" ry="60" fill="url(#cloud)" />
              {/* 文件 */}
              <rect
                x="110"
                y="70"
                width="60"
                height="80"
                rx="10"
                fill="#fff"
                stroke="#e0e7ff"
                strokeWidth="3"
              />
              <rect
                x="180"
                y="90"
                width="50"
                height="70"
                rx="8"
                fill="#fff"
                stroke="#fbc2eb"
                strokeWidth="3"
              />
              {/* 文件夹 */}
              <rect
                x="140"
                y="170"
                width="80"
                height="40"
                rx="10"
                fill="url(#folder)"
              />
              {/* 进度条 */}
              <rect x="150" y="200" width="60" height="10" rx="5" fill="#fff" />
              <rect
                x="150"
                y="200"
                width="36"
                height="10"
                rx="5"
                fill="url(#progress)"
              />
              {/* 小icon */}
              <circle cx="130" cy="110" r="7" fill="#60a5fa" />
              <rect
                x="200"
                y="120"
                width="12"
                height="12"
                rx="3"
                fill="#f87171"
              />
              <rect
                x="120"
                y="150"
                width="16"
                height="6"
                rx="3"
                fill="#fbbf24"
              />
              <defs>
                <linearGradient
                  id="cloud"
                  x1="50"
                  y1="80"
                  x2="290"
                  y2="200"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#a1c4fd" />
                  <stop offset="1" stopColor="#c2e9fb" />
                </linearGradient>
                <linearGradient
                  id="folder"
                  x1="140"
                  y1="170"
                  x2="220"
                  y2="210"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#fbc2eb" />
                  <stop offset="1" stopColor="#a6c1ee" />
                </linearGradient>
                <linearGradient
                  id="progress"
                  x1="150"
                  y1="200"
                  x2="210"
                  y2="210"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#fbc2eb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </main>

      {/* 底部 Slogan */}
      <footer className="text-center py-6 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold tracking-wide shadow-inner">
        安全 · 简单 · 美观 —— 让文件上传成为享受
      </footer>
    </div>
  );
}
