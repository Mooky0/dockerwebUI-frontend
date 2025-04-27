"use client";

import * as React from "react";
import { DockerImage, DockerImageList } from "@/types/image";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { getImageData } from "@/api/imageService";
import Paper from "@mui/material/Paper";
import { Collapse, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";

function Row(props: { row: DockerImage }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  let info: Record<string, string> = {};
  let envs: Record<string, string> = {};
  let labels: Record<string, string> = {};

  if (row.Config.Env) {
    row.Config.Env.forEach((env) => {
      const [key, value] = env.split("=");
      envs[key] = value;
    });
  }

  if (row.Config.Labels) {
    Object.entries(row.Config.Labels).forEach(([key, value]) => {
      labels[key] = value;
    });
  }

  info["Id"] = row.Id;
  info["Created"] = row.Created;
  info["Size"] = Math.round(row.Size / 1000000) + " MB";
  info["RepoTags"] = row.RepoTags.join(", ");
  info["RepoDigests"] = row.RepoDigests.join(", ");
  info["Comment"] = row.Comment;
  info["Exposed Ports"] = row.Config.ExposedPorts
    ? Object.keys(row.Config.ExposedPorts).join(", ")
    : "None";
  info["Cmd"] = row.Config.Cmd ? row.Config.Cmd.join(", ") : "None";
  if (typeof row.Config.Entrypoint === "string") {
    info["Entrypoint"] = row.Config.Entrypoint ? row.Config.Entrypoint : "None";
  } else if (Array.isArray(row.Config.Entrypoint)) {
    info["Entrypoint"] = row.Config.Entrypoint
      ? row.Config.Entrypoint.join(", ")
      : "None";
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
        <TableCell align="left">
          {row.RepoTags.length > 0 ? row.RepoTags[0] : "None"}
        </TableCell>
        <TableCell align="left">{row.Id}</TableCell>
        <TableCell align="right">
          {row.RepoTags.map((tag) => (
            <div key={tag}>{tag}</div>
          ))}
        </TableCell>
        <TableCell align="right">{Math.round(row.Size / 1000000)} MB</TableCell>
        <TableCell align="right">{row.Created}</TableCell>
        <TableCell align="center">
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              console.log("Delte iamge", row.Id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
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

export default function ImagesTable() {
  const [rows, setRows] = useState<DockerImageList>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getImageData()
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
            <TableCell align="left">Repository</TableCell>
            <TableCell align="left">Id</TableCell>
            <TableCell align="right">Tags</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Created</TableCell>
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
