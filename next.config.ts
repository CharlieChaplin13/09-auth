import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  htmlLimitedBots: /.*/,
  images: {
	  remotePatterns: [
	      { protocol: 'https', hostname: 'ac.goit.global' }
	    ]
	}
};

export default nextConfig;

