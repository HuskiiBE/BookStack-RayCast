// src/search-command.tsx
import React, { useState, useEffect } from 'react';
import { List, ActionPanel, Action, showToast, ToastStyle } from '@raycast/api';
import { searchBookStack, SearchResultItem } from './bookstack-api';

export default function SearchDocumentation() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [items, setItems] = useState<SearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setItems([]);
            return;
        }

        setIsLoading(true);

        searchBookStack(searchTerm)
            .then((results) => {
                setItems(results);
            })
            .catch((error) => {
                showToast(ToastStyle.Failure, 'Could not fetch results', error instanceof Error ? error.message : String(error));
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [searchTerm]);

    return (
        <List
            isLoading={isLoading}
            onSearchTextChange={setSearchTerm}
            searchBarPlaceholder="Search in BookStack"
            throttle
        >
            {items.map((item, index) => (
                <List.Item
                    key={item.id + index}  // Create a unique key using both id and index
                    title={item.name}
                    actions={
                        <ActionPanel>
                            <Action.OpenInBrowser url={item.url} title="Open URL" />
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    );
}
