import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button
} from "reactstrap";

interface TableData {
  _id: string;
  author: string;
  type: string;
  participants_count: number;
  common: {
    language: string;
    domain_rank: number;
  };
}

const ProjectTables: React.FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    fetchData();
  }, []); // Fetch data only once when component mounts

  const fetchData = () => {
    setLoading(true);
    fetch("https://finalhacathonbackend.vercel.app/news/get-news-with-common")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data: TableData[]) => {
        setTableData(data.map(item => ({ ...item, language: item.common.language, domainRank: item.common.domain_rank })));
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Card style={{ height: "500px", overflowY: "auto" }}>
      <CardBody>
        <CardTitle tag="h5">Project Listing</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Overview of the projects
        </CardSubtitle>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
          </div>
        ) : (
          <div>
            <div className="table-responsive">
              <Table className="text-nowrap mt-3 align-middle" borderless>
                <thead>
                  <tr>
                    <th>Team Lead</th>
                    <th>Language</th>
                    <th>Type</th>
                    <th>Participants Count</th>
                    <th>Domain Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((data, index) => (
                    <tr key={index} className="border-top">
                      <td>
                        <div className="d-flex align-items-center p-2">
                          <i
                            className="bi bi-person-circle"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                          <div className="ms-3">
                            <h6 className="mb-0">{data.author}</h6>
                            <span className="text-muted">{data.site_url}</span>
                          </div>
                        </div>
                      </td>
                      <td>{data.language}</td>
                      <td>{data.type}</td>
                      <td>{data.participants_count}</td>
                      <td>{data.domainRank}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ProjectTables;
