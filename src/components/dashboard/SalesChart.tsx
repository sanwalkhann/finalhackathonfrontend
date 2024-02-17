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

  const domainRanks = data.map(item => item.common?.domain_rank);
  const participantsCounts = data.map(item => item.participants_count);

  const replaceUndefinedWithPrevious = (arr: (number | undefined)[]) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === undefined) {
        arr[i] = arr[i - 1] as number; // Type assertion
        // Or, to filter out undefined values:
        // arr[i] = arr.slice(0, i).reverse().find((val) => val !== undefined) || 0;
      }
    }
  };
  

  const domainRanksFiltered = domainRanks.filter((rank) => rank !== undefined);
  const participantsCountsFiltered = participantsCounts.filter((count) => count !== undefined);

  replaceUndefinedWithPrevious(domainRanksFiltered);
  replaceUndefinedWithPrevious(participantsCountsFiltered);

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
      categories: domainRanksFiltered.map(String), // Convert domainRanks to strings
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
        formatter: (val: number) => `Domain Rank: ${val}`, // Use val as a number
      },
      y: [
        {
          formatter: (val: number) => `Participants Count: ${val}`, // Use val as a number
        },
        {
          formatter: (val: number) => `Domain Rank: ${val}`, // Use val as a number
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
      colors: ['#ff0000', '#00ff00'],
    },
  };
  

  const series = [
    {
      name: 'Participants Count',
      data: participantsCountsFiltered.map((count, index) => ({ x: domainRanksFiltered[index], y: count })),
      type: 'line',
    },
    {
      name: 'Domain Rank',
      data: domainRanksFiltered.map((rank, index) => ({ x: domainRanksFiltered[index], y: rank })),
      type: 'area',
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
