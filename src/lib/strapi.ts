import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';

export function getStrapiMedia(url: string | null | undefined) {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }
    return `${STRAPI_URL}${url}`;
}

interface StrapiMedia {
    data: {
        id: number;
        attributes: {
            url: string;
            alternativeText: string | null;
        }
    }
}

export interface Post {
    id: number;
    attributes: {
        title: string;
        slug: string;
        description: string;
        content: any; // This will be the rich text content
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        coverImage: StrapiMedia;
        imageHint?: string;
    }
}

interface StrapiResponse<T> {
    data: T[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
}

async function fetchStrapiAPI(path: string, urlParamsObject = {}, options = {}) {
    try {
        const mergedOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
            },
            ...options,
        };

        const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
        const requestUrl = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(requestUrl, mergedOptions);
        
        if (!response.ok) {
            console.error('Strapi API Error:', response.statusText);
            throw new Error(`An error occurred please try again`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`An error occurred please try again`);
    }
}

export async function getPosts(): Promise<Post[]> {
    const res: StrapiResponse<Post> = await fetchStrapiAPI('/articulos', {
        populate: ['coverImage'],
    });
    return res.data;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const res: StrapiResponse<Post> = await fetchStrapiAPI('/articulos', {
        filters: {
            slug: {
                $eq: slug,
            },
        },
        populate: ['coverImage'],
    });
    if (res.data && res.data.length > 0) {
        return res.data[0];
    }
    return null;
}
