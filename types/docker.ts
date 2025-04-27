// types/docker.ts
export type DockerDashboardInfo = {
  containersRunning: number;
  containersPaused: number;
  containersStopped: number;
  totalContainers: number;
  cpuUsagePercent: number;
  memoryUsageMB: number;
  memoryTotalMB: number;
  memoryUsagePercent: number;
  dockerVersion: string;
  systemTime: string;
};
