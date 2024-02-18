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
      const response = await fetch('http://localhost:3000/news/get-news-with-common');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: NewsItem[] = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const domainRanks = data.map(item => item.common?.domain_rank || 0);
  const participantsCounts = data.map(item => item.participants_count);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: domainRanks.map(String),
      title: {
        text: 'Domain Rank',
      },
    },
    yaxis: [
      {
        title: {
          text: 'Participants Count',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Domain Rank',
        },
      },
    ],
    tooltip: {
      enabled: true,
      intersect: false,
      shared: false,
    },
    colors: ['#00ff00', '#ff0000'], // Green for Participants Count, Red for Domain Rank
  };
  

  const series = [
    {
      name: 'Participants Count',
      data: participantsCounts,
    },
    {
      name: 'Domain Rank',
      data: domainRanks,
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
          type="bar"
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
