import type { CarApiResponse, ICar } from '@/interfaces/car-api';
import { PAGINATION_LIMIT_GARAGE } from '@/pages/pagination-page';
import { baseUrl } from '../constants';

const GARAGE_URL = `${baseUrl}/garage`;

export async function getCars(
  page: number,
  limit = PAGINATION_LIMIT_GARAGE,
): Promise<CarApiResponse> {
  const response = await fetch(`${GARAGE_URL}?_page=${page}&_limit=${limit}`);
  return { items: await response.json(), count: response.headers.get('X-Total-Count') ?? '0' };
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
