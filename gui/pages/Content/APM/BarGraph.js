كلام سليم 100% ومتكامل. أوافق على كل نقطة فيه، والتعديل اللي اقترحه (حماية data من أن تكون غير مصفوفة) ممتاز ويجعل الكود أكثر صلابة.

الخلاصة النهائية

استخدم هذه النسخة النهائية، هي الحل الجذري الكامل:

```javascript
import React, { useEffect, useRef } from "react";

let echartsCache = null;

const getEcharts = async () => {
  if (!echartsCache) {
    echartsCache = await import("echarts");
  }
  return echartsCache;
};

export const BarGraph = ({ data = [], type, color }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let chart = null;
    let resizeObserver = null;
    let cancelled = false;

    const render = async () => {
      if (!chartRef.current) return;

      const echarts = await getEcharts();

      if (cancelled || !chartRef.current) return;

      const safeData = Array.isArray(data) ? data : [];

      const instance = echarts.getInstanceByDom(chartRef.current);
      chart = instance || echarts.init(chartRef.current);

      chart.setOption({
        color,
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" }
        },
        xAxis: {
          type: "category",
          data: safeData.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 45,
            color: "#888"
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: value => (value >= 1000 ? `${value / 1000}k` : value)
          },
          splitLine: {
            lineStyle: { color: "rgba(255, 255, 255, 0.08)" }
          }
        },
        series: [
          {
            data: safeData.map(item =>
              type === "tokens_per_call"
                ? item.calls
                  ? item.tokens_consumed / item.calls
                  : 0
                : item[type]
            ),
            type: "bar"
          }
        ]
      });

      if (containerRef.current && typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => chart?.resize());
        resizeObserver.observe(containerRef.current);
      }
    };

    render();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      chart?.dispose();
    };
  }, [data, type, color]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default BarGraph;
```

المطلوب منك الآن

· ملف واحد فقط: pages/Content/APM/BarGraph.js
· احذف كل شيء وألصق الكود أعلاه
· ارفع commit وشغّل build

هذا هو الحل الجذري النهائي بدون ترقيع. بالتوفيق.
