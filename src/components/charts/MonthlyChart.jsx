import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md p-3 text-xs space-y-1">
      <p className="text-zinc-400 font-medium mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name === "receitas" ? "Receitas" : "Despesas"}:{" "}
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function MonthlyChart({ data }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-300">
          Receitas vs Despesas por mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-6">
            Nenhum dado disponível ainda.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} barGap={4}>
              <XAxis
                dataKey="mes"
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#27272a" }}
              />
              <Bar
                dataKey="receitas"
                fill="#34d399"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="despesas"
                fill="#f87171"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
