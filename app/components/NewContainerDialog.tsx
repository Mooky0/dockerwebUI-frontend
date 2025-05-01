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
} from "@mui/material";
import { createContainer } from "@/api/containerService";
import { FromData } from "@/types/container";

interface NewContainerDialogProps {
  handleClose: () => void;
}

const PortTextField = () => {
  return (
    <Box display="flex" alignItems="center" marginTop={0}>
      <FormControl fullWidth sx={{ pr: 1 }} variant="outlined">
        <TextField
          margin="dense"
          label="Host Port"
          type="text"
          variant="outlined"
        />
      </FormControl>
      <FormControl fullWidth sx={{ pl: 1 }} variant="outlined">
        <TextField
          margin="dense"
          label="Container Port"
          type="text"
          variant="outlined"
        />
      </FormControl>
    </Box>
  );
};

const NewContainerDialog: React.FC<NewContainerDialogProps> = ({
  handleClose,
}) => {
  const [containerName, setContainerName] = React.useState("");
  const [image, setImage] = React.useState("");
  const [ports, setPorts] = React.useState([
    { hostPort: "", containerPort: "" },
  ]);
  const [command, setCommand] = React.useState("");
  const [autoRemove, setAutoRemove] = React.useState(false);

  const isFormValid = containerName.trim() !== "" && image.trim() !== "";

  const handlePortChange = (index: number, field: string, value: string) => {
    console.log("Port changed", index, field, value);
    setPorts((prevPorts) =>
      prevPorts.map((port, i) =>
        i === index ? { ...port, [field]: value } : port
      )
    );
  };

  const handlePortRemove = (index: number) => {
    setPorts((prevPorts) => prevPorts.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    // Trim values locally
    console.log("Form submitted");
    console.log("Container Name:", containerName);
    console.log("Image:", image);
    console.log("Ports:", ports);
    console.log("Command:", command);
    console.log("Auto Remove:", autoRemove);
    const trimmedContainerName = containerName.trim();
    const trimmedImage = image.trim();
    const trimmedCommand = command.trim();
    const trimmedPorts = ports.map((port) => ({
      hostPort: port.hostPort.trim(),
      containerPort: port.containerPort.trim(),
    }));

    if (trimmedContainerName && trimmedImage) {
      const formData: FromData = {
        containerName: trimmedContainerName,
        imageName: trimmedImage,
        ports: trimmedPorts,
        command: trimmedCommand,
        autoRemove,
      };

      console.log("Form Data:", formData);

      createContainer(formData)
        .then(() => {
          handleClose();
          // Optionally reset the form fields
          setContainerName("");
          setImage("");
          setPorts([{ hostPort: "", containerPort: "" }]);
          setCommand("");
          setAutoRemove(false);
        })
        .catch((error) => {
          console.error("Error creating container:", error);
        });
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
          label="Container Name"
          type="text"
          fullWidth
          variant="outlined"
          value={containerName}
          onChange={(e) => setContainerName(e.target.value)}
        />
        <Box display="flex" alignItems="center" marginTop={2}>
          <div>docker.io/</div>
          <TextField
            sx={{ pl: 1 }}
            margin="dense"
            label="Image"
            type="text"
            fullWidth
            variant="outlined"
            required
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </Box>
        <TextField
          margin="dense"
          label="Command"
          type="text"
          fullWidth
          variant="outlined"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <Box
          display="flex"
          alignItems="center"
          marginTop={2}
          sx={{ mb: 1, mt: 1 }}
        >
          <div>Ports</div>
          <Button
            variant="outlined"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => {
              setPorts((prevPorts) => [
                ...prevPorts,
                { hostPort: "", containerPort: "" },
              ]);
            }}
          >
            Add Port
          </Button>
        </Box>
        {ports.map((port, index) => (
          <Box key={index} display="flex" alignItems="center">
            <FormControl fullWidth sx={{ pr: 1 }} variant="outlined">
              <TextField
                margin="dense"
                label="Host Port"
                type="text"
                variant="outlined"
                value={port.hostPort}
                onChange={(e) =>
                  handlePortChange(index, "hostPort", e.target.value)
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ pl: 1 }} variant="outlined">
              <TextField
                margin="dense"
                label="Container Port"
                type="text"
                variant="outlined"
                value={port.containerPort}
                onChange={(e) =>
                  handlePortChange(index, "containerPort", e.target.value)
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
        <Box display="flex" alignItems="center" marginTop={2}>
          <Checkbox
            sx={{ mt: 0 }}
            color="primary"
            checked={autoRemove}
            onChange={(e) => setAutoRemove(e.target.checked)}
          />
          <span>Autoremove</span>
        </Box>
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
