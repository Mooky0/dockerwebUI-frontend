import Link from "next/link";
import ProductCard from "./components/ProductCard";
import Button from "@mui/material/Button";
import { DockerDashboardInfo } from "@/types/docker";
import DockerDashboard from "@/app/components/DockerDashboard";

export default function Home() {
  let data: DockerDashboardInfo = {
    containersRunning: 5,
    containersPaused: 2,
    containersStopped: 3,
    totalContainers: 10,
    cpuUsagePercent: 15,
    memoryUsageMB: 2048,
    memoryTotalMB: 8192,
    memoryUsagePercent: 25,
    dockerVersion: "20.10.7",
    systemTime: new Date().toLocaleString(),
  };

  return (
    <>
      <DockerDashboard />
    </>
  );
}
