import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Só WebP: a codificação AVIF das ilustrações com transparência é lenta demais no
    // otimizador (travava as requisições), e o ganho sobre WebP é pequeno aqui.
    formats: ["image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1280, 1600],
    imageSizes: [48, 64, 96, 128, 192, 256, 320],
  },
};

export default nextConfig;
