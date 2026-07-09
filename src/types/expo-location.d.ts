declare module "expo-location" {
  export enum Accuracy {
    Balanced = 1,
    High = 2,
  }

  export type LocationObject = {
    coords: {
      latitude: number;
      longitude: number;
      altitude?: number | null;
      accuracy?: number | null;
      heading?: number | null;
      speed?: number | null;
    };
    timestamp: number;
  };

  export function getCurrentPositionAsync(options?: { accuracy?: Accuracy }): Promise<LocationObject>;
  export function getLastKnownPositionAsync(): Promise<LocationObject | null>;
  export function getForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function requestForegroundPermissionsAsync(): Promise<{ status: string }>;

  export const LocationAccuracy: typeof Accuracy;
}
