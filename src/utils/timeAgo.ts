export const timeAgo = (
  date?: Date | string | null
): string => {
  if (!date) return 'Data não encontrada!';

  const parsedDate = typeof date === 'string'
    ? new Date(date)
    : date;

  if (isNaN(parsedDate.getTime())) {
    return 'Data inválida';
  }

  const now = new Date();
  const diffMs = now.getTime() - parsedDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `Há ${years} ano${years > 1 ? 's' : ''}`;
  if (months > 0) return `Há ${months} mês${months > 1 ? 'es' : ''}`;
  if (weeks > 0) return `Há ${weeks} semana${weeks > 1 ? 's' : ''}`;
  if (days > 0) return `Há ${days} dia${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`;

  return 'agora mesmo';
};
