import { DockerVolume } from "@/types/volume";

export async function getVolumeData(): Promise<DockerVolume[]> {
  const response = await fetch("http://localhost:3300/volumes");

  //console.log("Response:", response);

  if (!response.ok) {
    throw new Error("Failed to fetch volume data");
  }

  return response.json();
}
