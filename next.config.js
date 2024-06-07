const webpack = require('webpack')
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { nextRuntime }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.fallback = { fs: false, net: false, tls: false };
    if (nextRuntime === "edge") {
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.JWT_SECRET": `"${process.env.JWT_SECRET}"`,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
