import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardSubtitle, CardTitle, CardText, Button } from 'reactstrap';
import { FaThumbsUp, FaComment } from 'react-icons/fa'; // Import thumbs up and comment icons

interface BlogItem {
  title: string;
  comments: number;
  likes: number;
  text: string;
  main_img_url?: string;
}

const Blog: React.FC = () => {
  const [blogData, setBlogData] = useState<BlogItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blogsPerPage] = useState<number>(3); // Adjust the number of blogs per page here
  const [expandedBlogIndex, setExpandedBlogIndex] = useState<number>(-1); // Index of the expanded blog, -1 means none expanded
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [commentText, setCommentText] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://finalhacathonbackend.vercel.app/news/get-news-with-common');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: BlogItem[] = await response.json();
        setBlogData(data);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Expand or collapse a blog text
  const handleExpandCollapse = (index: number) => {
    setExpandedBlogIndex(expandedBlogIndex === index ? -1 : index);
  };

  // Function to limit text to a certain number of words
  const limitText = (text: string, limit: number) => {
    const words = text.split(' ');
    return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
  };

  // Function to handle like
  const handleLike = (index: number) => {
    const updatedBlogs = [...blogData];
    updatedBlogs[index].likes += 1;
    setBlogData(updatedBlogs);
  };

  // Function to handle comment
  const handleComment = (index: number) => {
    // Add your comment functionality here
    // For simplicity, I'm just increasing the comment count
    const updatedBlogs = [...blogData];
    updatedBlogs[index].comments += 1;
    setBlogData(updatedBlogs);
  };

  const handleCommentSubmit = (index: number) => {
    // You can add code here to submit the comment to your backend
    console.log(`Comment submitted for blog at index ${index}: ${commentText}`);
    // Clear comment text after submission
    setCommentText('');
    // For simplicity, I'm just updating the comment count locally
    handleComment(index);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          {/* Your existing code */}
          {loading ? (
            // Show spinner while loading
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <>
              {/* Mapping through blogData */}
              {blogData
                .slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage)
                .map((blogItem, index) => (
                  <div key={index} className="mb-4 card-hover" style={{ transition: 'all 0.3s ease' }}>
                    <Card style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                      <CardBody>
                        <CardTitle tag="h5">{blogItem.title}</CardTitle>
                        <CardSubtitle>Comments: {blogItem.comments}</CardSubtitle>
                        <CardSubtitle>Likes: {blogItem.likes}</CardSubtitle>
                        <img
                          src={blogItem.main_img_url || 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                          alt="Main"
                          className="img-fluid mb-3"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <CardText>
                          {expandedBlogIndex === index ? blogItem.text : limitText(blogItem.text, 25)}
                        </CardText>
                        {/* Read more/less button */}
                        {blogItem.text.split(' ').length > 25 && (
                          <Button
                            color="link"
                            onClick={() => handleExpandCollapse(index)}
                            className="fw-bold text-decoration-none"
                          >
                            {expandedBlogIndex === index ? 'Read Less' : 'Read More'}
                          </Button>
                        )}
                        {/* Like and comment icons */}
                        <div className="d-flex align-items-center mt-3">
                          <Button color="link" onClick={() => handleLike(index)}>
                            <FaThumbsUp className="me-2" /> Like
                          </Button>
                          <Button color="link" onClick={() => handleComment(index)}>
                            <FaComment className="me-2" /> Comment
                          </Button>
                        </div>
                        {/* Comment form */}
                        <div className="mt-3">
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          ></textarea>
                          <Button
                            color="primary"
                            className="mt-2"
                            onClick={() => handleCommentSubmit(index)}
                            disabled={!commentText.trim()} // Disable button if comment text is empty or whitespace only
                          >
                            Submit
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              {/* Pagination */}
              <nav>
                <ul className="pagination justify-content-center">
                  {/* Previous button */}
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                      Prev
                    </button>
                  </li>
                  {/* Next button */}
                  <li className={`page-item ${currentPage === Math.ceil(blogData.length / blogsPerPage) ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;