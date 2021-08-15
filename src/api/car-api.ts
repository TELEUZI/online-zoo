import APIConstants from '../enums/api-constants';
import ICar, { CarApiResponse } from '../interfaces/car-api';

const GARAGE_URL = `${APIConstants.baseUrl}/garage`;

export async function getCars(
  page: number,
  limit = APIConstants.garageCarLimit,
): Promise<CarApiResponse> {
  const response = await fetch(`${GARAGE_URL}?_page=${page}&_limit=${limit}`);
  return { items: await response.json(), count: response.headers.get('X-Total-Count') };
}

export async function getCar(id: number): Promise<ICar> {
  return (await fetch(`${GARAGE_URL}/${id}`)).json();
}

export async function createCar(body: { name: string; color: string }): Promise<CarApiResponse> {
  return (
    await fetch(GARAGE_URL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
      },
    })
  ).json();
}

export async function deleteCar(id: number): Promise<CarApiResponse> {
  return (await fetch(`${GARAGE_URL}/${id}`, { method: 'DELETE' })).json();
}

export async function updateCar(
  id: number,
  body: { name: string; color: string },
): Promise<CarApiResponse> {
  return (
    await fetch(`${GARAGE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
      },
    })
  ).json();
}
