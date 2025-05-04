export interface DockerVolume {
  Name: string;
  Driver: string;
  Mountpoint: string;
  Status?: { [key: string]: string } | undefined;
  Labels: { [key: string]: string };
  Scope: "local" | "global";
  // Field is always present, but sometimes is null
  Options: { [key: string]: string } | null;
  // Field is sometimes present, and sometimes null
  UsageData?:
    | {
        Size: number;
        RefCount: number;
      }
    | null
    | undefined;
}

export type DockerVolumeList = DockerVolume[];

export interface VolumeCreateOptions {
  Name?: string | undefined;
  Driver?: string | undefined;
  DriverOpts?: { [key: string]: string } | undefined;
  Labels?: { [label: string]: string } | undefined;
  abortSignal?: AbortSignal;
}
