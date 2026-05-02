import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

const PIE_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#818cf8",
  "#4f46e5",
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md p-3 text-xs space-y-1">
      <p style={{ color: payload[0].payload.fill }} className="font-medium">
        {payload[0].name}
      </p>
      <p className="text-zinc-300">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function CategoryChart({ data }) {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));

  const isSingleCategory = data.length === 1;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-300">
          Despesas por categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-6">
            Nenhuma despesa registrada ainda.
          </p>
        ) : isSingleCategory ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: PIE_COLORS[0] }}
            >
              {data[0].name}
            </span>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(data[0].valor)}
            </p>
            <p className="text-xs text-zinc-600">100% das despesas</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={dataWithColors}
                dataKey="valor"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#a1a1aa", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
