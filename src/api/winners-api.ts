import type { WinnersInfo, WinnerInfo } from '@/interfaces/winner-api';
import { PAGINATION_LIMIT_WINNERS } from '@/pages/pagination-page';
import { baseUrl } from './constants';

const WINNERS_URL = `${baseUrl}/winners`;

function getSortOrder(sort: string, order: string) {
  return sort && order ? `&_sort=${sort}&_order=${order}` : '';
}

export async function getWinners(
  page: number,
  limit = PAGINATION_LIMIT_WINNERS,
  sort = 'id',
  order = 'ASC',
): Promise<WinnersInfo> {
  const response = await fetch(
    `${WINNERS_URL}?_page=${page}&_limit=${limit}${getSortOrder(sort, order)}`,
  );
  return { items: await response.json(), count: response.headers.get('X-Total-Count') ?? '0' };
}

export async function getWinner(id: number): Promise<WinnerInfo | Record<string, never>> {
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
  try {
    const response = await fetch(`${WINNERS_URL}/${id}`, { method: 'DELETE' });
    return await response.json();
  } catch (error) {
    return {};
  }
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
