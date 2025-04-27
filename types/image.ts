export interface DockerImage {
  Id: string;
  RepoTags: string[];
  RepoDigests: string[];
  Parent: string;
  Comment: string;
  Created: string;
  Container: string;
  ContainerConfig: {
    Hostname: string;
    Domainname: string;
    User: string;
    AttachStdin: boolean;
    AttachStdout: boolean;
    AttachStderr: boolean;
    ExposedPorts: { [portAndProtocol: string]: {} };
    Tty: boolean;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Env: string[];
    Cmd: string[];
    ArgsEscaped: boolean;
    Image: string;
    Volumes: { [path: string]: {} };
    WorkingDir: string;
    Entrypoint?: string | string[] | undefined;
    OnBuild?: any[] | undefined;
    Labels: { [label: string]: string };
  };
  DockerVersion: string;
  Author: string;
  Config: {
    Hostname: string;
    Domainname: string;
    User: string;
    AttachStdin: boolean;
    AttachStdout: boolean;
    AttachStderr: boolean;
    ExposedPorts: { [portAndProtocol: string]: {} };
    Tty: boolean;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Env: string[];
    Cmd: string[];
    ArgsEscaped: boolean;
    Image: string;
    Volumes: { [path: string]: {} };
    WorkingDir: string;
    Entrypoint?: string | string[] | undefined;
    OnBuild: any[];
    Labels: { [label: string]: string };
  };
  Architecture: string;
  Os: string;
  Size: number;
  VirtualSize: number;
  GraphDriver: {
    Name: string;
    Data: {
      DeviceId: string;
      DeviceName: string;
      DeviceSize: string;
    };
  };
  RootFS: {
    Type: string;
    Layers?: string[] | undefined;
    BaseLayer?: string | undefined;
  };
  Descriptor?:
    | {
        mediaType: string;
        digest: string;
        size: number;
        urls?: string[] | undefined;
        annotations?: { [key: string]: string } | undefined;
        data?: string | undefined;
        platform?:
          | {
              architecture: string;
              os: string;
              "os.version"?: string | undefined;
              "os.features"?: string[] | undefined;
              variant?: string | undefined;
            }
          | undefined;
        artifactType?: string | undefined;
      }
    | undefined;
}

export type DockerImageList = DockerImage[];
