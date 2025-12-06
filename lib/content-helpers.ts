import { Session } from './auth';

/**
 * Get content filter for queries based on user session
 * Returns filter that includes:
 * - Public content (churchId is null)
 * - User's church content (if user has a church)
 */
export function getContentFilter(session: Session | null): { churchId: string | null } | { OR: Array<{ churchId: string | null }> } {
    if (!session || !session.user.churchId) {
        // Not logged in or no church - only show public content
        return { churchId: null };
    }

    // Logged in with church - show public + their church content
    return {
        OR: [
            { churchId: null }, // Public content
            { churchId: session.user.churchId }, // Their church content
        ],
    };
}

/**
 * Check if user can create content for a given church
 * - Super Admins can create for any church or public (null)
 * - Church Admins can only create for their own church
 * - Regular users cannot create content
 */
export function canCreateContent(session: Session | null, targetChurchId: string | null): boolean {
    if (!session) {
        return false;
    }

    const { role, churchId } = session.user;

    // Super Admins can create anything
    if (role === 'SUPERADMIN') {
        return true;
    }

    // Church Admins can only create for their church
    if (role === 'CHURCH_ADMIN') {
        return targetChurchId === churchId;
    }

    // Regular users cannot create content
    return false;
}

/**
 * Get available church options for content creation
 * - Super Admins get all churches + "Public" option
 * - Church Admins get only their church
 */
export async function getChurchOptionsForContent(session: Session): Promise<Array<{ id: string | null; name: string }>> {
    const { role, churchId, church } = session.user;

    if (role === 'SUPERADMIN') {
        // Super Admins can create public content or for any church
        // For now, return Public option. In a full implementation, fetch all churches from DB
        return [
            { id: null, name: 'Public (All Users)' },
            // TODO: Fetch all churches from database
        ];
    }

    if (role === 'CHURCH_ADMIN' && church) {
        // Church Admins can only create for their church
        return [
            { id: church.id, name: church.name },
        ];
    }

    return [];
}
