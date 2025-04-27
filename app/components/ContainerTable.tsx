"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { getContainerData } from "../../api/containerService";
import { DockerContainer, DockerContainerList } from "../../types/container";
import { Button } from "@mui/material";
import {
  pauseContainer,
  startContainer,
  stopContainer,
  restartContainer,
  deleteContainer,
  unpauseContainer,
} from "../../api/containerService";
import { start } from "repl";

function Row(props: { row: DockerContainer }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [running, setRunning] = React.useState(row.State.Running);
  const [paused, setPaused] = React.useState(row.State.Paused);
  //const [restarting, setRestarting] = React.useState(row.State.Restarting);
  const [dead, setDead] = React.useState(row.State.Dead);
  //const [oomKilled, setOomKilled] = React.useState(row.State.OOMKilled);

  let info: Record<string, string> = {};
  let ports = row.NetworkSettings.Ports;
  let envs: Record<string, string> = {};
  let labels: Record<string, string> = {};

  if (row.Config.Env) {
    row.Config.Env.forEach((env) => {
      const [key, value] = env.split("=");
      envs[key] = value;
    });
  }

  labels = row.Config.Labels || {};

  info["Name"] = row.Name;
  info["State"] = row.State.Status;
  info["Id"] = row.Id;
  info["Image"] = row.Config.Image;
  info["Network Mode"] = row.HostConfig.NetworkMode
    ? row.HostConfig.NetworkMode
    : "undefined";
  info["IP Address"] = row.NetworkSettings.IPAddress;
  info["Gateway"] = row.NetworkSettings.Gateway;
  info["MAC Address"] = row.NetworkSettings.MacAddress;
  info["Created"] = row.State.StartedAt;
  info["CMD"] = row.Config.Cmd.toString();
  info["Entrypoint"] = row.Path;
  info["Arguments"] = row.Args.toString();
  var restartPolicy = row.HostConfig.RestartPolicy
    ? row.HostConfig.RestartPolicy
    : undefined;
  if (restartPolicy !== undefined) {
    info["Restart Policy"] =
      restartPolicy.Name +
      (restartPolicy.MaximumRetryCount
        ? restartPolicy.MaximumRetryCount
        : 0 > 0
        ? " (" + restartPolicy.MaximumRetryCount + ")"
        : "");
  } else {
    info["Restart Policy"] = "No Restart";
  }

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.Name}
        </TableCell>
        <TableCell align="right">{row.State.Status}</TableCell>
        <TableCell align="right">{row.Config.Image}</TableCell>
        <TableCell align="right">{row.State.StartedAt}</TableCell>
        <TableCell align="right">{row.NetworkSettings.IPAddress}</TableCell>
        <TableCell align="right">80:80</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => startContainer(row.Id)}
                        disabled={running || dead}
                      >
                        Start
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => stopContainer(row.Id)}
                        disabled={!running || dead}
                      >
                        Stop
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => restartContainer(row.Id)}
                        disabled={!running || dead}
                      >
                        Restart
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => pauseContainer(row.Id)}
                        disabled={!running || paused || dead}
                      >
                        Pause
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => console.log("Kill")}
                        disabled={!running || dead}
                      >
                        Kill
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteContainer(row.Id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {Object.entries(info).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Port Configuration
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Host Port</TableCell>
                    <TableCell>Container Port</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(ports).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>
                        {value?.map((port) => (
                          <div key={port.HostIp + "" + port.HostPort}>
                            {port.HostIp}:{port.HostPort}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Environmental Variables
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(envs).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Labels
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(labels).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const [containers, setContainers] = useState<DockerContainerList>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getContainerData()
      .then((data) => setContainers(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">State</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">IP address</TableCell>
            <TableCell align="right">Published Ports</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {containers.map((container) => (
            <Row key={container.Name} row={container} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
