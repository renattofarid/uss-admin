"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AsistanceByYear, getAsistanceByYear } from "@/services/reports"
let chartData = [
  { key: "attended", count: 0, fill: "hsl(var(--chart-1))" },
  { key: "pending", count: 0, fill: "hsl(var(--chart-3))" },
]

const chartConfig = {
  attended: {
    label: "Participaron",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "No Participaron",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function AssistanceByYear() {
  // const totalVisitors = React.useMemo(() => {
  //   return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  // }, [])

  const [assistanceByYear, setAssistanceByYear] = React.useState<AsistanceByYear | null>(null)

  React.useEffect(() => {
    (
      async () => {
        const data = await getAsistanceByYear()
        setAssistanceByYear(data)
        chartData = [
          { key: "attended", count: data["2024"].attended, fill: "hsl(var(--chart-1))" },
          { key: "pending", count: data["2024"].pending, fill: "hsl(var(--chart-3))" },
        ]
      }
    )()
  }, [])

  const totalCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [assistanceByYear])


  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Porcentaje de Docentes que Participaron y No Participaron en las capacitaciones en el año</CardTitle>
        <CardDescription>2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="key"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={15}
              label={
                ({ cx, cy, midAngle, innerRadius, outerRadius, fill, payload }) => {
                  const RADIAN = Math.PI / 180
                  const radius = 25 + innerRadius + (outerRadius - innerRadius)
                  const x = cx + radius * Math.cos(-midAngle * RADIAN)
                  const y = cy + radius * Math.sin(-midAngle * RADIAN)

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={fill}
                      fontSize={12}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {/* {payload.key} */}
                      {(payload.count / totalCount * 100).toFixed(2)}%
                    </text>
                  )
                }
              }
            >
              {/* {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))} */}
              {/* <LabelList dataKey="key"
                position="outside"
                fill="#000000"
                stroke="none"
                fontSize={12} /> */}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Docentes
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  )
}
