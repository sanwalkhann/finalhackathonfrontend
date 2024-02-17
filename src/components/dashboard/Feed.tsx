import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  CardSubtitle,
  ListGroupItem,
  Button,
  Spinner
} from "reactstrap";
import { formatDistanceToNow } from 'date-fns';

interface Feed {
  author: string;
  published: string; // Assuming published is a string representing a date
  // Add other properties as needed
}

const Feeds = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]); // Specify Feed[] as the type
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("https://finalhacathonbackend.vercel.app/news/get-news-with-common")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setFeeds(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = feeds.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(feeds.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="w-100" style={{ maxWidth: "400px" }}>
      <CardBody>
        <CardTitle tag="h5">Feeds</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Authors and publications
        </CardSubtitle>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
          </div>
        ) : (
          <ListGroup flush className="mt-4">
            {currentItems.map((feed, index) => (
              <ListGroupItem
                key={index}
                action
                href="/"
                tag="a"
                className="d-flex align-items-center p-3 border-0 feed-item"
              >
                <div className="me-3">
                  <i
                    className="bi bi-person-circle"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </div>
                <div>
                  <div>{feed.author}</div>
                </div>
                <div className="ms-auto">
                  <small className="text-muted">
                    {formatDistanceToNow(new Date(feed.published), { addSuffix: true })}
                  </small>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
        <div className="d-flex justify-content-between mt-4">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(feeds.length / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Feeds;
