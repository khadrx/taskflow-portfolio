import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تفعيل React Compiler (اختياري، بس لو شغال كويس خلّيه)
  reactCompiler: true,

  // أهم حاجة: خلّي الـoutput standalone عشان الـdeployment أسهل (Vercel/Railway/Docker)
  output: "standalone",



  // لو عايز تتجاهل أخطاء TypeScript أثناء الـbuild (مش مستحسن طويل الأمد، بس لو عايز تختبر)
  // typescript: {
  //   ignoreBuildErrors: true,
  // },

  // إعدادات إضافية مفيدة للـperformance والـdeployment
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // لو بتستخدم experimental features (اختياري)
  experimental: {
    // لو عايز تمنع الـprerender errors مؤقتًا
    // missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;