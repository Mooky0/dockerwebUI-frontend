import { DockerContainerList } from "../types/container";

export async function getContainerData(): Promise<DockerContainerList> {
  const response = await fetch("http://localhost:3300/containers");

  //importconsole.log("Response:", response);

  if (!response.ok) {
    throw new Error("Failed to fetch container data");
  }

  return response.json();
}

// Create a new container
// This function sends a POST request to the server to create a new container
export async function createContainer(formData: {
  containerName: string;
  imageName: string;
  ports: { hostPort: string; containerPort: string }[];
  command: string;
  autoRemove: boolean;
}): Promise<void> {
  console.log(
    "Form Data:",
    JSON.stringify({
      formData,
    })
  );
  const response = await fetch("http://localhost:3300/containers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create container");
  }
}

export async function deleteContainer(containerId: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3300/containers/${containerId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        containerId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete container");
  }
}
export async function startContainer(containerId: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3300/containers/${containerId}/start`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to start container");
  }
}
export async function stopContainer(containerId: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3300/containers/${containerId}/stop`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to stop container");
  }
}
export async function restartContainer(containerId: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3300/containers/${containerId}/restart`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to restart container");
  }
}
export async function pauseContainer(containerId: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3300/containers/${containerId}/pause`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to pause container");
  }
}
export async function unpauseContainer(containerId: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3300/containers/${containerId}/unpause`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to unpause container");
  }
}
