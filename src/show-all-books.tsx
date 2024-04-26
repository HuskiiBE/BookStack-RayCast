// src/show-all-books.tsx
import React, { useState, useEffect } from 'react';
import { List, ActionPanel, Action, showToast, ToastStyle } from '@raycast/api';
import { getAllBooks, SearchResultItem } from './bookstack-api';

export default function ShowAllBooks() {
    const [books, setBooks] = useState<SearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getAllBooks()
            .then((bookData) => {
                setBooks(bookData);
                setIsLoading(false);
            })
            .catch((error) => {
                showToast(ToastStyle.Failure, "Couldn't fetch books", error.message);
                setIsLoading(false);
            });
    }, []);

    return (
        <List isLoading={isLoading} searchBarPlaceholder="Search books...">
            {books.map((book) => (
                <List.Item
                    key={book.id.toString()}
                    title={book.name}
                    subtitle={book.description}
                    accessoryTitle={book.url}
                    actions={
                        <ActionPanel>
                            <Action.OpenInBrowser url={`https://yourbookstackdomain.com${book.url}`} />
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    );
}
