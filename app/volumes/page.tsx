"use client";

import React, { useState } from "react";
import VolumeTable from "@/app/components/volumeTable";
import { Button, Dialog } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewVolumeDialog from "@/app/components/NewVolumeDialog";
import Box from "@mui/material/Box";

const VolumesPage = () => {
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
        <h1>Volumess</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          <AddIcon />
          New Volume
        </Button>
      </Box>
      <VolumeTable />

      {/* Popup Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <NewVolumeDialog handleClose={handleClose} />
      </Dialog>
    </>
  );
};

export default VolumesPage;
