// import bundleAnalyzer from "@next/bundle-analyzer";
// import type { NextConfig } from "next";
// const withBundleAnalyzer = bundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// });
// const nextConfig: NextConfig = {
//   reactCompiler: true,
//   output: "standalone",
//   productionBrowserSourceMaps: false,
//   reactStrictMode: false,
//   experimental: {
//     scrollRestoration: true,
//     serverActions: {
//       bodySizeLimit: "30mb",
//     },
//   },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       issuer: /\.[jt]sx?$/,
//       use: [
//         {
//           loader: "@svgr/webpack",
//           options: {
//             icon: true,
//             svgo: true,
//             svgoConfig: {
//               plugins: [
//                 { name: "removeViewBox", active: false },
//                 { name: "removeDimensions", active: true },
//               ],
//             },
//           },
//         },
//       ],
//     });
//     return config;
//   },
// };
// // ⚡️ export 시점에 애널라이저 적용
// export default withBundleAnalyzer(nextConfig);
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    serverActions: { bodySizeLimit: "30mb" },
  },
  // ❌ webpack() 블록 제거 — Turbopack은 이 설정 무시함
};

export default nextConfig;
