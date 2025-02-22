/** @type {import('next').NextConfig} */
const nextConfig = {
    // env: {
    //   NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    //   NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    //   DATABASE_URL: process.env.DATABASE_URL,
    // },
    webpack(config) {
      console.log("Env variables in next.config.mjs:", process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      return config;
    },
  };
  
  export default nextConfig;
  