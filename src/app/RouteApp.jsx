"use client";

import { usePathname } from "next/navigation";
import App from "../App";

export default function RouteApp() {
  return <App url={usePathname()} />;
}
