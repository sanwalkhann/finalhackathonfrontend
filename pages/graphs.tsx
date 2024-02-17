import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Article {
  title: string;
  participants_count: number;
  domain_rank: number;
  spam_score: number;
}

const GraphPage: React.FC = () => {
  const [data, setData] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://finalhacathonbackend.vercel.app/news/get-news-with-common');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const fetchedData = await response.json();
      const processedData: Article[] = fetchedData.map((article: any) => ({
        title: article.title,
        participants_count: article.participants_count || 0,
        domain_rank: article.common ? article.common.domain_rank || 0 : 0,
        spam_score: article.common ? article.common.spam_score || 0 : 0
      }));
      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const lineChartData = {
    options: {
      chart: {
        id: 'article-chart',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        type: 'category', // Set type to 'category'
        categories: data.map(article => article.title),
        labels: {
          show: false
        }
      },
      yaxis: [
        {
          title: {
            text: 'Participants Count'
          }
        },
        {
          opposite: true,
          title: {
            text: 'Domain Rank'
          }
        },
        {
          opposite: true,
          title: {
            text: 'Spam Score'
          }
        }
      ],
      title: {
        text: 'Article Statistics',
        align: 'center', // Align property can be included if necessary
        style: {
          fontSize: '20px',
          color: '#333'
        }
      }
    },
    series: [
      {
        name: 'Participants Count',
        type: 'line',
        data: data.map(article => article.participants_count)
      },
      {
        name: 'Domain Rank',
        type: 'line',
        data: data.map(article => article.domain_rank)
      },
      {
        name: 'Spam Score',
        type: 'line',
        data: data.map(article => article.spam_score)
      }
    ]
  };
  
  

  const bubbleChartData = {
    options: {
      chart: {
        id: 'bubble-chart',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        type: 'category',
        categories: data.map(article => article.title),
        labels: {
          show: false
        }
      },
      yaxis: {
        title: {
          text: 'Participants Count'
        }
      },
      title: {
        text: 'Article Statistics (Bubble Chart)',
        align: 'center',
        style: {
          fontSize: '20px',
          color: '#333'
        }
      }
    },
    series: [
      {
        name: 'Participants Count',
        data: data.map(article => ({
          x: article.title,
          y: article.participants_count,
          z: 10 // Set a fixed size for bubbles
        }))
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white', position: 'relative' }}>
      <header style={{ padding: '20px', color: 'black', textAlign: 'center' }}>
        <h1>BillBoard</h1>
      </header>
      <div style={{ flex: 1 }}>
        <Button color="dark" onClick={handleGoBack}>Go Back</Button>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Article Statistics (Line Chart)</h2>
        <Chart
          options={lineChartData.options}
          series={lineChartData.series}
          type="line"
          height={400}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h2>Article Statistics (Bubble Chart)</h2>
        <Chart
          options={bubbleChartData.options}
          series={bubbleChartData.series}
          type="bubble"
          height={400}
        />
      </div>
    </div>
  );
};

export default GraphPage;
