// src/bookstack-api.ts
import axios from 'axios';
import { getPreferenceValues } from '@raycast/api';

interface Preferences {
    baseUrl: string;
    tokenId: string;
    tokenSecret: string;
}

interface SearchResult {
    data: SearchResultItem[];
    // Add any other properties from the API response as needed
}

export interface SearchResultItem {
    id: number;
    name: string;
    url: string;
    type: string;
    // Add additional properties from the API response as needed
}

const preferences: Preferences = getPreferenceValues<Preferences>();
const apiClient = axios.create({
    baseURL: preferences.baseUrl,
    headers: {
        'Authorization': `Token ${preferences.tokenId}:${preferences.tokenSecret}`
    }
});

export async function searchBookStack(query: string): Promise<SearchResultItem[]> {
    const response = await apiClient.get<SearchResult>('/api/search', {
        params: { query }
    });
    // Ensure that the response.data.data is an array before returning
    if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    throw new Error('Search results are not in expected format');
}

export async function getAllBooks(): Promise<SearchResultItem[]> {
    const response = await apiClient.get('/api/books');
    if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map((book) => ({
            id: book.id,
            name: book.name,
            description: book.description,
            url: `/books/${book.slug}`  // Assuming the URL follows this pattern
            // Adjust as needed if the URL needs to be built differently
        }));
    }
    throw new Error('Books data is not in the expected format');
}