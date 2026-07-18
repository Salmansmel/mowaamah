import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfjs-dist", "mammoth"],
  // pdfjs-dist loads its worker file via a runtime-computed path that Next's
  // static file-tracing can't follow, so it gets dropped from the serverless
  // bundle unless explicitly included here.
  outputFileTracingIncludes: {
    "/api/analyze": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
};

export default nextConfig;
