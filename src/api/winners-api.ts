import APIConstants from '../enums/api-constants';
import { WinnersInfo, WinnerInfo } from '../interfaces/winner-api';

const WINNERS_URL = `${APIConstants.baseUrl}/winners`;

function getSortOrder(sort: string, order: string) {
  return sort && order ? `&_sort=${sort}&_order=${order}` : '';
}

export async function getWinners(
  page?: number,
  limit = APIConstants.winnerCarLimit,
  sort?: string,
  order?: string,
): Promise<WinnersInfo> {
  const response = await fetch(
    `${WINNERS_URL}?_page=${page}&limit=${limit}${getSortOrder(sort, order)}`,
  );
  return { items: await response.json(), count: response.headers.get('X-Total-Count') };
}

export async function getWinner(id: number): Promise<WinnerInfo> {
  return (await fetch(`${WINNERS_URL}/${id}`)).json();
}

export async function createWinner(body: WinnerInfo): Promise<WinnerInfo> {
  return (
    await fetch(WINNERS_URL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
      },
    })
  ).json();
}

export async function deleteWinner(id: number): Promise<Record<string, never>> {
  if ((await getWinners()).items.find((winners) => winners.id === id))
    return (await fetch(`${WINNERS_URL}/${id}`, { method: 'DELETE' })).json();
  return null;
}
export async function updateWinner(
  id: number,
  body: { wins: number; time: number },
): Promise<WinnerInfo> {
  return (
    await fetch(`${WINNERS_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
      },
    })
  ).json();
}
