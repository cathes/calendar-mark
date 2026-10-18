import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NotificationProvider } from "@/components/NotificationProvider";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "Calendar Mark",
  description: "Manage your schedule with a calendar to view, create, edit, and organize events in monthly and weekly views.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en">
  <body>
    <NotificationProvider>
      {children}
    </NotificationProvider>
  </body>
</html>;
}
