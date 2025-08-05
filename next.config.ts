import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true, // <- 이거는 viewBox 기준으로 반응형으로 만들어줌
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                },
                {
                  name: "removeDimensions", // ✅ 핵심: width/height 제거
                  active: true,
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
