import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface NewsItem {
  _id: string;
  common?: {
    domain_rank?: number;
  };
  participants_count: number;
}

const SalesChart: React.FC = () => {
  const [data, setData] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://finalhacathonbackend.vercel.app/news/get-news-with-common');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: NewsItem[] = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const domainRanks = data.map(item => item.common?.domain_rank).filter(Boolean);
  const participantsCounts = data.map(item => item.participants_count);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 3,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    stroke: {
      curve: 'smooth',
      width: 1,
    },
    xaxis: {
      categories: domainRanks,
      title: {
        text: '',
      },
      labels: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: 'Participants Count',
        },
        opposite: false,
      },
      {
        title: {
          text: 'Domain Rank',
        },
        opposite: true,
      },
    ],
    tooltip: {
      enabled: true,
      intersect: false,
      shared: false,
      x: {
        show: true,
        formatter: (val: string) => `Domain Rank: ${val}`,
      },
      y: [
        {
          formatter: (val: number) => `Participants Count: ${val}`,
        },
        {
          formatter: (val: number) => `Domain Rank: ${val}`,
        },
      ],
    },
    colors: ['#ff0000', '#00ff00'], // Red for Domain Rank, Green for Participants Count
    fill: {
      type: 'solid',
      colors: ['#ff000080', '#00ff0080'], // Transparent fill for area charts
    },
    markers: {
      size: 1,
      colors: ['#00ff00', '#00ff00'],
    },
  };

  const series = [
    {
      name: 'Participants Count',
      data: participantsCounts,
      type: 'line',
      yAxis: 0,
    },
    {
      name: 'Domain Rank',
      data: domainRanks,
      type: 'area',
      yAxis: 1,
    },
  ];

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Domain Rank vs Participants Count</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Sales Summary
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height={390}
          options={chartOptions}
          series={series}
        />
      </CardBody>
    </Card>
  );
};

export default SalesChart;
