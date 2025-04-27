"use client";

import React, { useState } from "react";
import ContainerTable from "../components/ContainerTable";
import Box from "@mui/material/Box";
import { Button, Dialog } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewContainerDialog from "@/app/components/NewContainerDialog";

const ContainersPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h1>Containers Page</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          <AddIcon />
          New Container
        </Button>
      </Box>
      <ContainerTable />

      {/* Popup Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <NewContainerDialog handleClose={handleClose} />
      </Dialog>
    </>
  );
};

export default ContainersPage;
