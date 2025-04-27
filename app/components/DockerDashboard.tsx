"use client";

import { useEffect, useState } from "react";
import { DockerDashboardInfo } from "@/types/docker";
import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

export default function DockerDashboard() {
  const [data, setData] = useState<DockerDashboardInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData({
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
    });
    setLoading(false);
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!data) return <p>Error loading data.</p>;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4}>
        Docker Host Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid component="div" size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Containers
            </Typography>
            <Typography>Running: {data.containersRunning}</Typography>
            <Typography>Paused: {data.containersPaused}</Typography>
            <Typography>Stopped: {data.containersStopped}</Typography>
            <Typography>Total: {data.totalContainers}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Info
            </Typography>
            <Typography>Docker Version: {data.dockerVersion}</Typography>
            <Typography>System Time: {data.systemTime}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Memory Usage
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: data.memoryUsageMB, label: "Used MB" },
                    {
                      id: 1,
                      value: data.memoryTotalMB - data.memoryUsageMB,
                      label: "Free MB",
                    },
                  ],
                },
              ]}
              width={400}
              height={250}
            />
            <Typography textAlign="center" mt={2}>
              {data.memoryUsagePercent.toFixed(2)}% Used
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              CPU Usage
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: data.cpuUsagePercent, label: "CPU Used" },
                    {
                      id: 1,
                      value: 100 - data.cpuUsagePercent,
                      label: "CPU Free",
                    },
                  ],
                },
              ]}
              width={400}
              height={250}
            />
            <Typography textAlign="center" mt={2}>
              {data.cpuUsagePercent.toFixed(2)}% Used
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
