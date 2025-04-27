import { DockerNetwork } from "@/types/network";

export async function getNetworkData(): Promise<DockerNetwork[]> {
  const response = await fetch("http://localhost:3300/networks");

  if (!response.ok) {
    throw new Error("Failed to fetch network data");
  }

  return response.json();
}
