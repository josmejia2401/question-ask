// formatters.js

export const formatDate = (isoDateStr) => {
  const date = new Date(isoDateStr);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (isoDateStr) => {
  const date = new Date(isoDateStr);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export function formatDateTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);

  const pad = (num) => num.toString().padStart(2, '0');

  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yy = date.getFullYear().toString().slice(-2);

  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${dd}-${mm}-${yy} ${hh}:${mi}:${ss}`;
}


export function getRelativeTimeDescription(inputDate) {
  const date = new Date(inputDate);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
  const diffYears = now.getFullYear() - date.getFullYear();

  if (diffSec < 10) return "hace unos segundos";
  if (diffSec < 60) return `hace ${diffSec} segundos`;
  if (diffMin < 2) return "hace un minuto";
  if (diffMin < 60) return `hace ${diffMin} minutos`;
  if (diffHrs < 2) return "hace una hora";
  if (diffHrs < 24) return `hace ${diffHrs} horas`;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "ayer";
  }

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return "hoy";
  }

  if (diffDays < 30) return `hace ${diffDays} días`;
  if (diffMonths < 2) return "este mes";
  if (diffMonths < 12) return `hace ${diffMonths} meses`;
  if (diffYears < 2) return "este año";
  return `hace ${diffYears} años`;
}
