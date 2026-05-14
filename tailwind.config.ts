import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#123D2A",
        fresh: "#5DBB63",
        lime: "#B7E75A",
        cream: "#F7F4EA",
        charcoal: "#1F2933",
        autumn: "#C46A2B",
        winter: "#DDF4FF"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(18, 61, 42, 0.16)",
        glass: "0 16px 40px rgba(18, 61, 42, 0.12)"
      },
      backgroundImage: {
        grass:
          "linear-gradient(135deg, rgba(18,61,42,.72), rgba(18,61,42,.42)), url('https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1800&q=85')",
        hedge:
          "linear-gradient(135deg, rgba(18,61,42,.82), rgba(18,61,42,.32)), url('https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1800&q=85')"
      }
    }
  },
  plugins: []
};

export default config;
