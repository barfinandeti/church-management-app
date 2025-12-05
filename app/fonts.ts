import { Inter, Playfair_Display, Noto_Sans_Telugu, Noto_Serif_Telugu, Sree_Krushnadevaraya } from 'next/font/google';

export const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

export const notoSansTelugu = Noto_Sans_Telugu({
    subsets: ['telugu'],
    variable: '--font-noto-sans-telugu',
    display: 'swap',
});

export const notoSerifTelugu = Noto_Serif_Telugu({
    subsets: ['telugu'],
    variable: '--font-noto-serif-telugu',
    display: 'swap',
});

export const sreeKrushnadevaraya = Sree_Krushnadevaraya({
    weight: '400',
    subsets: ['telugu'],
    variable: '--font-sree-krushnadevaraya',
    display: 'swap',
});
