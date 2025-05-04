import { DockerVolume, VolumeCreateOptions } from "@/types/volume";

export async function getVolumeData(): Promise<DockerVolume[]> {
  const response = await fetch("http://localhost:3300/volumes");

  //console.log("Response:", response);

  if (!response.ok) {
    throw new Error("Failed to fetch volume data");
  }

  return response.json();
}

export async function deleteVolume(volumeId: string): Promise<void> {
  const response = await fetch(`http://localhost:3300/volumes/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ volumeId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete volume");
  }
  window.location.reload();
}

export async function createVolume(
  options: VolumeCreateOptions
): Promise<void> {
  const response = await fetch(`http://localhost:3300/volumes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Name: options.Name,
      driver: options.Driver,
      labels: options.Labels,
      options: options.DriverOpts,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create volume");
  }
}
