import { getPosts } from '@/lib/strapi';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}
