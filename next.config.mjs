// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   trailingSlash: true,
//   images: {
//     unoptimized: true,
//   },
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fetalultrasoundmanual.com",
      },
    ],
  },

};

export default nextConfig;