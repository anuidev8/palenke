"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type CategoryChartMeta = {
  key: string;
  label: string;
  count: number;
  pct: number;
  color: string;
  icon: LucideIcon;
};

export type BoardChartMeta = {
  key: string;
  label: string;
  count: number;
  pct: number;
  fill: string;
};

type AdminAlertsChartsProps = {
  total: number;
  categories: CategoryChartMeta[];
  boards: BoardChartMeta[];
};

type TooltipPayload = {
  payload?: {
    label?: string;
    count?: number;
    pct?: number;
    fill?: string;
  };
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-[#e8dfd3] bg-white p-6 shadow-sm">
      <div className="mb-2">
        <h3 className="font-display text-lg font-bold text-[#1a1a1a]">{title}</h3>
        <p className="text-xs text-[#7a756e]">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function CategoryTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-xl border border-[#e8dfd3] bg-white px-3 py-2.5 shadow-lg">
      <p className="text-sm font-bold text-[#1a1a1a]">{item.label}</p>
      <p className="mt-1 text-xs text-[#7a756e]">
        {item.count} reporte{item.count === 1 ? "" : "s"} · {item.pct}%
      </p>
    </div>
  );
}

function BoardTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-xl border border-[#e8dfd3] bg-white px-3 py-2.5 shadow-lg">
      <p className="text-sm font-bold text-[#1a1a1a]">{item.label}</p>
      <p className="mt-1 text-xs text-[#7a756e]">
        {item.count} reporte{item.count === 1 ? "" : "s"} · {item.pct}%
      </p>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-[#e8dfd3] bg-[#fdfcfb] px-6 text-center">
      <p className="max-w-xs text-sm text-[#7a756e]">{message}</p>
    </div>
  );
}

export function AdminAlertsCharts({ total, categories, boards }: AdminAlertsChartsProps) {
  const categoryRows = categories.map((cat) => ({
    key: cat.key,
    label: cat.label,
    count: cat.count,
    pct: cat.pct,
    fill: cat.color,
  }));

  const boardRows = boards.map((board) => ({
    key: board.key,
    label: board.label,
    count: board.count,
    pct: board.pct,
    fill: board.fill,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard
        title="Distribución de Amenazas Ambientales"
        subtitle="Porcentaje por categoría de alerta comunitaria"
      >
        {total === 0 ? (
          <EmptyChart message="No hay reportes con los filtros actuales. Ajusta los filtros o espera nuevas alertas." />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryRows}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ebe4da" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "#7a756e", fontSize: 11 }}
                  axisLine={{ stroke: "#e8dfd3" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={128}
                  tick={{ fill: "#3a3530", fontSize: 11, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CategoryTooltip />} cursor={{ fill: "rgba(46, 125, 50, 0.06)" }} />
                <Bar dataKey="pct" radius={[0, 8, 8, 0]} barSize={20} animationDuration={600}>
                  {categoryRows.map((row) => (
                    <Cell key={row.key} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {total > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <span
                  key={cat.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e8dfd3] bg-[#fdfcfb] px-2.5 py-1 text-[10px] font-semibold text-[#4a4540]"
                >
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${cat.color}18` }}
                  >
                    <Icon className="h-3 w-3" style={{ color: cat.color }} aria-hidden />
                  </span>
                  {cat.count}
                </span>
              );
            })}
          </div>
        ) : null}
      </ChartCard>

      <ChartCard
        title="Asociación de Origen (Visual Boards)"
        subtitle="Reportes clasificados por el tablero desde el cual se reportó"
      >
        {total === 0 ? (
          <EmptyChart message="Sin datos de tablero de origen para los filtros seleccionados." />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={boardRows} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebe4da" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#3a3530", fontSize: 10, fontWeight: 600 }}
                  axisLine={{ stroke: "#e8dfd3" }}
                  tickLine={false}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={56}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#7a756e", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip content={<BoardTooltip />} cursor={{ fill: "rgba(46, 125, 50, 0.06)" }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} maxBarSize={52} animationDuration={600}>
                  {boardRows.map((row) => (
                    <Cell key={row.key} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </div>
  );
}
