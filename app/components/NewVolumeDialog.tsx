import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  FormControl,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { createVolume } from "@/api/volumeService";
import { VolumeCreateOptions } from "@/types/volume";

interface NewContainerDialogProps {
  handleClose: () => void;
}

const NewContainerDialog: React.FC<NewContainerDialogProps> = ({
  handleClose,
}) => {
  const [volumeName, setVolumeName] = React.useState("");
  const [driver, setDriver] = React.useState("");
  const [labels, setLabels] = React.useState([
    { labelName: "", labelValue: "" },
  ]);
  const [command, setCommand] = React.useState("");
  const [autoRemove, setAutoRemove] = React.useState(false);

  const isFormValid = volumeName.trim() !== "" && driver.trim() !== "";

  const handlePortChange = (index: number, field: string, value: string) => {
    console.log("Port changed", index, field, value);
    setLabels((prevLabels) =>
      prevLabels.map((label, i) =>
        i === index ? { ...label, [field]: value } : label
      )
    );
  };

  const handlePortRemove = (index: number) => {
    setLabels((prevLabels) => prevLabels.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    // Trim values locally
    console.log("Form submitted");
    console.log("Container Name:", volumeName);
    console.log("Image:", driver);
    console.log("Labels:", labels);
    console.log("Command:", command);
    console.log("Auto Remove:", autoRemove);
    const trimmedVolumeName = volumeName.trim();
    const trimmedDriver = driver.trim();
    const trimmedLabels = labels.map((label) => ({
      labelName: label.labelName.trim(),
      labelValue: label.labelValue.trim(),
    }));

    if (trimmedVolumeName && trimmedDriver) {
      const formData: VolumeCreateOptions = {
        Name: trimmedVolumeName,
        Driver: trimmedDriver,
        Labels: {},
        DriverOpts: {},
        abortSignal: undefined,
      };

      console.log("Form Data:", formData);

      createVolume(formData)
        .then(() => {
          handleClose();
          // Optionally reset the form fields
          setVolumeName("");
          setDriver("");
          setLabels([{ labelName: "", labelValue: "" }]);
          setCommand("");
          setAutoRemove(false);
        })
        .catch((error) => {
          console.error("Error creating container:", error);
        });

      window.location.reload();
    }
  };

  return (
    <>
      <DialogTitle>Create New Container</DialogTitle>
      <DialogContent>
        <TextField
          required
          autoFocus
          margin="dense"
          label="Volume Name"
          type="text"
          fullWidth
          variant="outlined"
          value={volumeName}
          onChange={(e) => setVolumeName(e.target.value)}
        />
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={driver}
          label="Age"
          onChange={(e) => setDriver(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mt: 1, mb: 1 }}
        >
          <MenuItem value={"bridge"}>bridge</MenuItem>
          <MenuItem value={"host"}>host</MenuItem>
          <MenuItem value={"overlay"}>overlay</MenuItem>
          <MenuItem value={"macvlan"}>macvlan</MenuItem>
          <MenuItem value={"ipvlan"}>ipvlan</MenuItem>
          <MenuItem value={"none"}>none</MenuItem>
          <MenuItem value={"local"}>local</MenuItem>
        </Select>
        <Box
          display="flex"
          alignItems="center"
          marginTop={2}
          sx={{ mb: 1, mt: 1 }}
        >
          <div>Labels</div>
          <Button
            variant="outlined"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => {
              setLabels((prevLabels) => [
                ...prevLabels,
                { labelName: "", labelValue: "" },
              ]);
            }}
          >
            Add Label
          </Button>
        </Box>
        {labels.map((label, index) => (
          <Box key={index} display="flex" alignItems="center">
            <FormControl fullWidth sx={{ pr: 1 }} variant="outlined">
              <TextField
                margin="dense"
                label="Label name"
                type="text"
                variant="outlined"
                value={label.labelName}
                onChange={(e) =>
                  handlePortChange(index, "labelName", e.target.value)
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ pl: 1 }} variant="outlined">
              <TextField
                margin="dense"
                label="Label value"
                type="text"
                variant="outlined"
                value={label.labelValue}
                onChange={(e) =>
                  handlePortChange(index, "labelValue", e.target.value)
                }
              />
            </FormControl>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ ml: 1 }}
              onClick={() => handlePortRemove(index)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          color="primary"
          type="submit"
          disabled={!isFormValid}
        >
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

export default NewContainerDialog;
