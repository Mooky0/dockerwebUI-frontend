export interface NetworkContainer {
  Name: string;
  EndpointID: string;
  MacAddress: string;
  IPv4Address: string;
  IPv6Address: string;
}

export interface IPAM {
  Driver: string;
  Config?: Array<{ [key: string]: string }> | undefined;
  Options?: { [key: string]: string } | undefined;
}

export interface DockerNetwork {
  Name: string;
  Id: string;
  Created: string;
  Scope: string;
  Driver: string;
  EnableIPv6: boolean;
  IPAM?: IPAM | undefined;
  Internal: boolean;
  Attachable: boolean;
  Ingress: boolean;
  ConfigFrom?: { Network: string } | undefined;
  ConfigOnly: boolean;
  Containers?: { [id: string]: NetworkContainer } | undefined;
  Options?: { [key: string]: string } | undefined;
  Labels?: { [key: string]: string } | undefined;
}

export type DockerNetworkList = DockerNetwork[];
