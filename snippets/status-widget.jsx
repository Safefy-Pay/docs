import { useEffect, useMemo, useState } from "react";

export const StatusWidget = () => {
  const healthUrl = "https://api-payment.safefypay.com.br/health";
  const storageKey = "safefy_api_status_history_v1";
  const maxPoints = 48;
  const intervalMs = 60000;

  function readHistory() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((entry) => typeof entry?.t === "number" && typeof entry?.ok === "boolean")
        .slice(-maxPoints);
    } catch {
      return [];
    }
  }

  function writeHistory(history) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history.slice(-maxPoints)));
    } catch {}
  }

  function formatTime(timestamp) {
    try {
      return new Date(timestamp).toLocaleString("pt-BR");
    } catch {
      return "";
    }
  }

  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const initial = readHistory();
    setHistory(initial);

    let isMounted = true;

    const check = async () => {
      const startedAt = Date.now();
      try {
        const response = await fetch(healthUrl, { method: "GET", cache: "no-store" });
        if (!isMounted) return;
        const ok = response.ok;
        setStatus(ok);
        setLastChecked(startedAt);
        const next = [...readHistory(), { t: startedAt, ok }].slice(-maxPoints);
        setHistory(next);
        writeHistory(next);
      } catch {
        if (!isMounted) return;
        setStatus(false);
        setLastChecked(startedAt);
        const next = [...readHistory(), { t: startedAt, ok: false }].slice(-maxPoints);
        setHistory(next);
        writeHistory(next);
      }
    };

    check();
    const intervalId = setInterval(check, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const points = useMemo(() => {
    if (!history.length) return [];
    return history.map((entry) => (entry.ok ? 1 : 0));
  }, [history]);

  const bars = useMemo(() => {
    const size = points.length || 1;
    const gap = 2;
    const width = 120;
    const height = 36;
    const barWidth = Math.max(1, Math.floor((width - gap * (size - 1)) / size));

    return {
      width,
      height,
      bars: points.map((value, index) => {
        const x = index * (barWidth + gap);
        const barHeight = value ? height : Math.max(6, Math.floor(height * 0.3));
        const y = height - barHeight;
        return { x, y, barWidth, barHeight, value };
      }),
    };
  }, [points]);

  const statusLabel = status === null ? "Verificando" : status ? "Online" : "Offline";
  const statusColor = status === null ? "#9ca3af" : status ? "#22c55e" : "#ef4444";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200/80 bg-white/70 p-6 text-zinc-900 shadow-sm dark:border-white/10 dark:bg-zinc-900/40 dark:text-white">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Status da API de Pagamentos
          </div>
          <div className="text-2xl font-semibold">{statusLabel}</div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Endpoint: {healthUrl}
          </div>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: statusColor }}
          aria-label={statusLabel}
        >
          <span className="text-sm font-semibold">{status ? "OK" : status === null ? "..." : "X"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Últimas verificações</div>
        <div className="flex items-center gap-4">
          <svg width={bars.width} height={bars.height} viewBox={`0 0 ${bars.width} ${bars.height}`}>
            {bars.bars.map((bar, index) => (
              <rect
                key={`${bar.x}-${index}`}
                x={bar.x}
                y={bar.y}
                width={bar.barWidth}
                height={bar.barHeight}
                rx={2}
                fill={bar.value ? "#22c55e" : "#ef4444"}
              />
            ))}
          </svg>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Atualiza a cada 60s
          </div>
        </div>
        {lastChecked && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Última verificação: {formatTime(lastChecked)}
          </div>
        )}
      </div>
    </div>
  );
};
