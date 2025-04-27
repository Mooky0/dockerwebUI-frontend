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
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { getNetworkData } from "@/api/networkService";
import {
  DockerNetwork,
  DockerNetworkList,
  IPAM,
  NetworkContainer,
} from "@/types/network";

function Row(props: { row: DockerNetwork }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const info: Record<string, string> = {};
  let labels: Record<string, string> = {};
  let options: Record<string, string> = {};

  if (row.Labels) {
    Object.entries(row.Labels).forEach(([key, value]) => {
      labels[key] = value;
    });
  }
  if (row.Options) {
    Object.entries(row.Options).forEach(([key, value]) => {
      options[key] = value;
    });
  }

  info["Id"] = row.Id;
  info["Created"] = row.Created;
  info["Enable IPv6"] = row.EnableIPv6 ? "Yes" : "No";
  info["Internal"] = row.Internal ? "Yes" : "No";
  info["Attachable"] = row.Attachable ? "Yes" : "No";
  info["Ingress"] = row.Ingress ? "Yes" : "No";

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
        <TableCell align="right">{row.Scope}</TableCell>
        <TableCell align="right">{row.Driver}</TableCell>
        <TableCell align="right">
          {row.IPAM?.Config && row.IPAM.Config[0]?.Subnet
            ? row.IPAM.Config[0].Subnet
            : "-"}
        </TableCell>
        <TableCell align="right">
          {row.IPAM?.Config && row.IPAM.Config[0]?.Gateway
            ? row.IPAM.Config[0].Gateway
            : "-"}
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              console.log("Delete network", row.Name);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography variant="h6" gutterBottom component="div">
                Network Info
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {Object.entries(info).map(([key, value]) => {
                    if (key === "Containers") return null;
                    return (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          {key}
                        </TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Containers
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>IPV4 Address</TableCell>
                    <TableCell align="right">IPV6 Address</TableCell>
                    <TableCell align="right">MAC Address</TableCell>
                    <TableCell align="right">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Containers &&
                    Object.entries(row.Containers).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          {value.Name}
                        </TableCell>
                        <TableCell>{value.IPv4Address}</TableCell>
                        <TableCell align="right">
                          {value.IPv6Address ? value.IPv6Address : "-"}
                        </TableCell>
                        <TableCell align="right">{value.MacAddress}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => {
                              console.log("Delete container", key);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          {"Leave Network"}
                        </TableCell>
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
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Options
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(options).map(([key, value]) => (
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
export default function NetworkTable() {
  const [rows, setRows] = useState<DockerNetworkList>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNetworkData()
      .then((data) => setRows(data))
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
            <TableCell>Network Name</TableCell>
            <TableCell align="right">Scope</TableCell>
            <TableCell align="right">Driver</TableCell>
            <TableCell align="right">IPV4 Subnet</TableCell>
            <TableCell align="right">IPV4 Gateway</TableCell>
            <TableCell align="right">&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.Id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
