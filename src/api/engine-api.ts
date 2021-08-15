import APIConstants from '../enums/api-constants';
import { CarChars, DriveStatus } from '../interfaces/engine-api';

const ENGINE_URL = `${APIConstants.baseUrl}/engine`;

export async function startEngine(id: number): Promise<CarChars> {
  return (await fetch(`${ENGINE_URL}/?id=${id}&status=started`)).json();
}
export async function stopEngine(id: number): Promise<CarChars> {
  return (await fetch(`${ENGINE_URL}/?id=${id}&status=stopped`)).json();
}
export async function drive(id: number): Promise<DriveStatus> {
  const response = await fetch(`${ENGINE_URL}?id=${id}&status=drive`).catch();
  return response.status !== 200 ? { success: false } : { ...(await response.json()) };
}
