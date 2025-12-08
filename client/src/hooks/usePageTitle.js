import { useEffect } from 'react';

export const usePageTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title ? `${title} | Bharat Swaraj` : 'Bharat Swaraj - Latest News & Updates';

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};
