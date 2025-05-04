import { DockerImageList } from "@/types/image";

export async function getImageData(): Promise<DockerImageList> {
  const response = await fetch("http://localhost:3300/images");

  //console.log("Response:", response);

  if (!response.ok) {
    throw new Error("Failed to fetch image data");
  }

  return response.json();
}

export async function deleteImage(imageId: string): Promise<void> {
  const response = await fetch(`http://localhost:3300/images/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }
  window.location.reload();
}
