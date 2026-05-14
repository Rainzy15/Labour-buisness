import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LuxLawn Care Admin",
    short_name: "LuxLawn Admin",
    description: "Manage LuxLawn Care bookings, customers, employees, services, equipment, invoices, and operations.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F7F4EA",
    theme_color: "#123D2A",
    categories: ["business", "productivity", "utilities"],
    icons: [
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/pwa-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "Bookings",
        short_name: "Bookings",
        description: "Open booking management",
        url: "/admin/bookings",
        icons: [{ src: "/pwa-icon.svg", sizes: "any", type: "image/svg+xml" }]
      },
      {
        name: "Create Job",
        short_name: "New Job",
        description: "Create a manual job",
        url: "/admin/bookings",
        icons: [{ src: "/pwa-icon.svg", sizes: "any", type: "image/svg+xml" }]
      },
      {
        name: "Calendar",
        short_name: "Calendar",
        description: "Open operations calendar",
        url: "/admin/calendar",
        icons: [{ src: "/pwa-icon.svg", sizes: "any", type: "image/svg+xml" }]
      }
    ]
  };
}
