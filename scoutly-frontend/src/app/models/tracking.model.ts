export interface TrackingResponseDTO {
  id: string;
  name: string;
  url: string;
  targetPrice: number;
  currentPrice?: number;
  active: boolean;
}

export interface TrackingRequestDTO {
  name: string;
  url: string;
  targetPrice: number;
}
