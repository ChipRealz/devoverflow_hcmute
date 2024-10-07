import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Match all API routes except /api/webhook and /api/chatgpt
    '/api((?!/webhook|/chatgpt).*)',  // This matches all API routes except specified ones
    // Public routes that should not trigger the middleware
    '/',
    '/question/:id',
    '/tags',
    '/tags/:id',
    '/profile/:id',
    '/community',
    '/jobs',
    // Add more public routes if necessary
  ],
};
