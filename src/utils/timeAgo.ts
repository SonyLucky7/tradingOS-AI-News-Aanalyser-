// Helper function to format timestamps dynamically like "2 mins ago", "5 mins ago", "1 hr ago"

export function formatTimeAgo(timestamp: string | Date | number | undefined): string {
  if (!timestamp) return 'Just now';

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Just now';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes === 1) return '1 min ago';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hr ago';
    if (diffInHours < 24) return `${diffInHours} hrs ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  } catch {
    return 'Just now';
  }
}
