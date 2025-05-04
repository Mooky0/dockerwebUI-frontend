"use client";

import * as React from "react";
import { DockerVolume, DockerVolumeList } from "@/types/volume";
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
import { getVolumeData } from "@/api/volumeService";
import Paper from "@mui/material/Paper";
import { Collapse } from "@mui/material";

function Row(props: { row: DockerVolume }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

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
        <TableCell align="right">{row.Name}</TableCell>
        <TableCell align="right">{row.Driver}</TableCell>
        <TableCell align="right">{row.Mountpoint}</TableCell>
        <TableCell align="right">CreateAt</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div>
              <h4>Details</h4>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {Object.entries(row).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell align="right">
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function VolumeTable() {
  const [rows, setRows] = useState<DockerVolumeList>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVolumeData()
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
            <TableCell>Name</TableCell>
            <TableCell align="right">Driver</TableCell>
            <TableCell align="right">Mount Point</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.Name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
