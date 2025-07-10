import { Copy, ExternalLink, Star } from "lucide-react";
import { useState } from "react";

export function ApiSdkQuickStart() {
  const [copied, setCopied] = useState(false);
  const installCmd = "npm i secret-saas-api";

  return (
    <div className="bg-gradient-to-r from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <Star className=" text-pink-600  mr-2"></Star>
        <span className="text-xl font-bold text-white mr-2">secret-saas-api</span>
        <a
          href="https://www.npmjs.com/package/secret-saas-api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-pink-400"
          title="View on npm"
        >
          <ExternalLink className="inline w-5 h-5" />
        </a>
        <a
          href="https://github.com/你的github/secret-saas-api"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-gray-400 hover:text-blue-400"
          title="View on GitHub"
        >
          <svg className="inline w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            {/* GitHub logo SVG */}
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.37.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>
      <div className="mb-3">
        <span className="text-gray-300">Install via npm:</span>
        <div className="flex items-center mt-2 bg-[#181836] rounded px-3 py-2">
          <code className="text-pink-400 font-mono">{installCmd}</code>
          <button
            className="ml-2 text-gray-400 hover:text-pink-400"
            onClick={() => {
              navigator.clipboard.writeText(installCmd);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            title="Copy"
          >
            <Copy className="w-5 h-5" />
          </button>
          {copied && <span className="ml-2 text-green-400 text-sm">Copied!</span>}
        </div>
      </div>
      <div>
        <span className="text-gray-300">Quick usage:</span>
        <pre className="bg-[#181836] rounded px-3 py-2 mt-2 text-white text-sm overflow-x-auto">
{`import { createApiClient } from "secret-saas-api";

const apiClient = createApiClient({apiKey: "YOUR_FILEFLOW_SECRET"})
// Example: call your API with apiKey
const result = await apiClient.fileOpen.ApiMethod()
`}
        </pre>
      </div>
    </div>
  );
}