import { SupportedLanguage } from "@/types/supported-language";

export const dateUtils = {
    timeSince(date: Date, lang: SupportedLanguage = "es"): string {
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 0) {
            return lang === "es" ? "En el futuro" : "in the future";
        }

        const translations = {
            en: {
                justNow: "Just now",
                ago: "ago",
                units: {
                    year: ["year", "years"],
                    month: ["month", "months"],
                    week: ["week", "weeks"],
                    day: ["day", "days"],
                    hour: ["hour", "hours"],
                    minute: ["minute", "minutes"],
                    second: ["second", "seconds"],
                },
            },
            es: {
                justNow: "Justo ahora",
                ago: "Hace",
                units: {
                    year: ["año", "años"],
                    month: ["mes", "meses"],
                    week: ["semana", "semanas"],
                    day: ["día", "días"],
                    hour: ["hora", "horas"],
                    minute: ["minuto", "minutos"],
                    second: ["segundo", "segundos"],
                },
            },
        };

        const t = translations[lang];

        const intervals: [keyof typeof t.units, number][] = [
            ["week", 604800],
            ["day", 86400],
            ["hour", 3600],
            ["minute", 60],
            ["second", 1],
        ];

        for (const [unit, value] of intervals) {
            const delta = Math.floor(seconds / value);
            if (delta >= 1) {
                const unitLabel = delta === 1 ? t.units[unit][0] : t.units[unit][1];
                return lang === "es"
                    ? `${t.ago} ${delta} ${unitLabel}`
                    : `${delta} ${unitLabel} ${t.ago}`;
            }
        }

        // Calendar-aware months and years
        const start = new Date(date);
        const end = new Date(now);
        let months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

        if (end.getDate() < start.getDate()) {
            months -= 1;
        }

        if (months >= 12) {
            const years = Math.floor(months / 12);
            const label = years === 1 ? t.units.year[0] : t.units.year[1];
            return lang === "es"
                ? `${t.ago} ${years} ${label}`
                : `${years} ${label} ${t.ago}`;
        } else if (months >= 1) {
            const label = months === 1 ? t.units.month[0] : t.units.month[1];
            return lang === "es"
                ? `${t.ago} ${months} ${label}`
                : `${months} ${label} ${t.ago}`;
        }

        return t.justNow;
    },
};
