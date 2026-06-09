export const newsDateFormatter = (date: Date | null): string | undefined =>
  date?.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const notificationDateTimeFormatter = (date: Date | null): string | undefined => {
  if (!date || Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
