export interface ICar {
  name: string;
  color: string;
  id: number;
}
export interface CarApiResponse {
  items: ICar[];
  count: string;
}
