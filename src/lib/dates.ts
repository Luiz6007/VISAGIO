import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const fmt = (d: string, p = "dd/MM/yyyy") => format(parseISO(d), p, { locale: ptBR });

export function elapsed(d: string) {
  const days = differenceInCalendarDays(new Date(), parseISO(d));
  if (days <= 0) return "Hoje";
  if (days === 1) return "Há 1 dia";
  if (days < 30) return `Há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "Há 1 mês" : `Há ${months} meses`;
  const y = Math.floor(months / 12);
  return y === 1 ? "Há 1 ano" : `Há ${y} anos`;
}

