import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AdminCheckInWidgets({ 
  chart,
  ...other 
}) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const [activeIndex, setActiveIndex] = useState(null);

  const chartColors = chart.colors ?? [
    [theme.palette.error.light, theme.palette.error.main],
    [theme.palette.success.light, theme.palette.success.main],
    [theme.palette.warning.light, theme.palette.warning.main],
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    stroke: { width: 0 },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: chartColors[0][0], opacity: 1 },
          { offset: 100, color: chartColors[0][1], opacity: 1 },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            fontSize: theme.typography.subtitle2.fontSize,
            fontWeight: theme.typography.subtitle2.fontWeight,
          },
        },
      },
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={
          <Divider
            flexItem
            orientation={smUp ? 'vertical' : 'horizontal'}
            sx={{ borderStyle: 'dashed' }}
          />
        }
      >
        {chart.series.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              py: 5,
              gap: 3,
              width: 1,
              display: 'flex',
              px: { xs: 3, sm: 0 },
              alignItems: 'center',
              justifyContent: { sm: 'center' },
              cursor: 'pointer',
              color: chartColors[index][1],
              // bgcolor: chartColors[index][0],
              // opacity: 0.5,
            }}
            onClick={() => {
              setActiveIndex(index);
            }}
          >
            <Chart
              type="radialBar"
              series={[item.percent]}
              options={{
                ...chartOptions,
                ...(item.label !== 'Sold' && {
                  fill: {
                    type: 'gradient',
                    gradient: {
                      colorStops: [
                        { offset: 0, color: chartColors[index][0], opacity: 1 },
                        { offset: 100, color: chartColors[index][1], opacity: 1 },
                      ],
                    },
                  },
                }),
              }}
              width={80}
              height={80}
            />

            <div>
              <Box sx={{ mb: 0.5, typography: 'h5' }}>{fNumber(item.total)}</Box>
              <Box sx={{ typography: 'body2', color: chartColors[index][1] }}><b>{item.label}</b></Box>
            </div>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
