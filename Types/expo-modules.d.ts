
declare module "expo-device" {
  export const modelName: string;
  export const deviceName: string;
  export const deviceYearClass: number;
  export const isDevice: boolean;
  export function getDeviceTypeAsync(): Promise<number>;
  export function getIpAddressAsync(): Promise<string>;
}

declare module "expo-network" {
  export function getIpAddressAsync(): Promise<string>;
  export function getNetworkStateAsync(): Promise<{
    type: string;
    isConnected: boolean;
    isInternetReachable: boolean | null;
  }>;
}
