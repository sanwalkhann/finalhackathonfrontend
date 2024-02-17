import Head from "next/head";
import { Col, Row } from "reactstrap";
import SalesChart from "../src/components/dashboard/SalesChart";
import ProjectTables from "../src/components/dashboard/ProjectTable";
import TopCards from "../src/components/dashboard/TopCards";
import Blog from "../src/components/dashboard/Blog";
import bg1 from "../src/assets/images/bg/bg1.jpg";
import bg2 from "../src/assets/images/bg/bg2.jpg";
import bg3 from "../src/assets/images/bg/bg3.jpg";
import bg4 from "../src/assets/images/bg/bg4.jpg";
import Feeds from "@/src/components/dashboard/Feed";
import { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
interface BlogItem {
  image: StaticImageData;
  title: string;
  subtitle: string;
  description: string;
  btnbg: string;
}
const BlogData: BlogItem[] = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];
export default function Home(): JSX.Element {
  const [uniqueAuthorsCount, setUniqueAuthorsCount] = useState(0);
  const [totalSpamScore, setTotalSpamScore] = useState(0);
  const [totalParticipantsCount, setTotalParticipantsCount] = useState(0);
  const [totalDomainRank, setTotalDomainRank] = useState(0);
  useEffect(() => {
    // Fetch data from your API endpoint and calculate totals
    fetch("https://finalhacathonbackend.vercel.app/news/get-news-with-common")
      .then((response) => response.json())
      .then((data) => {
        let uniqueAuthors = new Set();
        let totalSpamScore = 0;
        let totalParticipantsCount = 0;
        let totalDomainRank = 0;
        data.forEach((item: any) => {
          uniqueAuthors.add(item.author);
          totalParticipantsCount += item.participants_count;
          
          // Access domain_rank and spam_score from the common object
          if (item.common) {
            if (typeof item.common.spam_score === 'number' && !isNaN(item.common.spam_score)) {
              totalSpamScore += Math.max(item.common.spam_score, 0);
            }
            
            if (typeof item.common.domain_rank === 'number' && !isNaN(item.common.domain_rank)) {
              totalDomainRank += item.common.domain_rank;
            }
          }
        });
  
        setUniqueAuthorsCount(uniqueAuthors.size);
        setTotalSpamScore(parseFloat(totalSpamScore.toFixed(2)));
        setTotalParticipantsCount(totalParticipantsCount);
        setTotalDomainRank(totalDomainRank);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  
  const formatNumber = (value: number) => {
    if (value > 1000) {
      return (value / 1000).toFixed(1) + "k";
    }
    return value.toString();
  };
  return (
    <div>
      <Head>
        <title>Xtreme Starter Next Js App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/* Top Cards */}
        <Row>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-success text-success"
              title="Unique Authors"
              subtitle="Total Authors"
              earning={uniqueAuthorsCount}
              icon="bi bi-person-circle"
            />
          </Col>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-danger text-danger"
              title="Total Spam Score"
              subtitle="Total Score"
              earning={formatNumber(totalSpamScore)}
              icon="bi bi-globe"
            />
          </Col>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-warning text-warning"
              title="Total Participants"
              subtitle="Total Participants"
              earning={formatNumber(totalParticipantsCount)}
              icon="bi bi-people"
            />
          </Col>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-info text-info"
              title="Total Domain Rank"
              subtitle="Total Rank"
              earning={formatNumber(totalDomainRank)}
              icon="bi bi-bar-chart-line"
            />
          </Col>
        </Row>
        {/* Sales & Feed */}
        <Row>
          <Col sm="12" lg="6" xl="7" xxl="8">
            <SalesChart />
          </Col>
          <Col sm="12" lg="6" xl="5" xxl="4">
            <Feeds />
          </Col>
        </Row>
        {/* Table */}
        <Row>
          <Col lg="12" sm="12">
            <ProjectTables />
          </Col>
        </Row>
        {/* Blog Cards
        <Row>
          {BlogData.map((blg) => (
            <Col sm="6" lg="6" xl="3" key={blg.title}>
              <Blog
                image={blg.image.src}
                title={blg.title}
                subtitle={blg.subtitle}
                text={blg.description}
                color={blg.btnbg}
              />
            </Col>
          ))}
        </Row> */}
      </div>
    </div>
  );
}