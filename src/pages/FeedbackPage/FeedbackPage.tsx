import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Rating,
  TextField,
  Box,
  Snackbar,
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../Context/UserContext';

interface Review {
  id: string;
  text: string;
  dateAdded: string;
  userID: string;
  reported: boolean;
  rating: number;
  reports: Report[];
}
interface Report {
  id: string;
  text: string;
  dateAdded: string;
}
interface NewReview {
  text: string;
  rating: number;
  userId: string;
  productId: string;
}

function FeedbackPage() {
  const { user } = useUserContext();
  const { id } = useParams();
  const parsedId = id ?? '-1';
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<NewReview>({
    text: '',
    rating: 0,
    userId: user!.Id,
    productId: parsedId,
  });
  const [reportedFeedbackId, setReportedFeedbackId] = useState<string | null>(
    null,
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchReviewsAndReports = async () => {
      try {
        const reviewsResponse = await axios.get<Review[]>(
          `https://localhost:7026/api/Review/GetReviewsByProductId/${parsedId}`,
        );

        const updatedReviews = await Promise.all(
          reviewsResponse.data.map(async (review) => {
            try {
              const reportsResponse = await axios.get<Report[]>(
                `https://localhost:7026/api/Report/GetReportsByReviewId/${review.id}`,
              );
              return {
                ...review,
                reports: reportsResponse.data,
              };
            } catch (error) {
              console.error('Error fetching reports:', error);
              return review;
            }
          }),
        );

        setReviews(updatedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviewsAndReports();
  }, [parsedId, newReview, reportedFeedbackId, snackbarOpen]);

  const [showReviewForm, setShowReviewForm] = useState(false);

  const [showReportForm, setShowReportForm] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState<string>('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReportClick = (feedbackId: string) => {
    setReportedFeedbackId(feedbackId);
    setShowReportForm(feedbackId);
  };

  const handleAddReview = async () => {
    if (!newReview.text || newReview.rating === 0) {
      setSnackbarMessage('Please fill in all required fields for the review.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        'https://localhost:7026/api/Review/AddNewReview',
        newReview,
      );

      console.log('New review added:', response.data);

      const updatedReviews = await axios.get<Review[]>(
        `https://localhost:7026/api/Review/GetReviewsByProductId/${parsedId}`,
      );
      setReviews(updatedReviews.data);

      setNewReview({
        text: '',
        rating: 0,
        userId: user!.Id,
        productId: parsedId,
      });

      setShowReviewForm(false);
    } catch (error) {
      console.error('Error adding review:', error);
      setSnackbarMessage('Error adding review. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleAddReport = async () => {
    if (!reportDetails) {
      setSnackbarMessage('Please provide report details.');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post('https://localhost:7026/api/Report/AddNewReport', {
        text: reportDetails,
        userId: user!.Id,
        reviewId: reportedFeedbackId!,
      });

      setReportedFeedbackId(null);
      setShowReportForm(null);
      setReportDetails('');
      setSnackbarMessage('Report submitted successfully.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding report:', error);
      setSnackbarMessage('Error adding report. Please try again.');
      setSnackbarOpen(true);
    }
  };
  const handleRemoveReview = async (reviewId: string) => {
    try {
      await axios.delete(
        `https://localhost:7026/api/Review/DeleteReview/${reviewId}`,
      );
      setSnackbarMessage('Review removed successfully.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error removing review:', error);
      setSnackbarMessage('Error removing review. Please try again.');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Button
        component={Link}
        to={`/Toys/${id}`}
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 8 }}
      >
        Go back to item
      </Button>
      <Typography variant="h4" gutterBottom>
        Feedback
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: 2 }}
        onClick={() => setShowReviewForm(!showReviewForm)}
      >
        Write a Review
      </Button>

      {showReviewForm && (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ marginBottom: '1rem' }}
        >
          <TextField
            label="Your Review"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={newReview.text}
            onChange={(e) =>
              setNewReview({ ...newReview, text: e.target.value })
            }
          />
          <Rating
            name="review-rating"
            precision={0.5}
            size="large"
            value={newReview.rating}
            onChange={(event, newValue) =>
              setNewReview({ ...newReview, rating: newValue || 0 })
            }
            sx={{ marginBottom: '1rem' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddReview}
            sx={{ display: 'block', margin: 'auto' }}
          >
            Submit Review
          </Button>
        </Box>
      )}

      {reviews &&
        reviews.map((review) => (
          <Box key={review.id}>
            <Card variant="outlined" sx={{ mb: 2, mt: 2 }}>
              <CardContent>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {review.text}
                </Typography>
                <Rating value={review.rating} precision={0.5} readOnly />
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Added on {new Date(review.dateAdded).toLocaleString()}
                </Typography>
                {review.reported && (
                  <Typography variant="body2" sx={{ color: 'red', mt: 1 }}>
                    This review has been reported.
                  </Typography>
                )}
                {user?.Id === review.userID && (
                  <Button
                    size="small"
                    variant="contained"
                    component={Link}
                    to={`/Toys/${parsedId}/Feedback/EditFeedback/${parsedId}/${review.id}`}
                  >
                    Edit
                  </Button>
                )}
                {review.reports &&
                  review.reports.length > 0 &&
                  user?.Role === 'Admin' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveReview(review.id)}
                    >
                      Remove Review
                    </Button>
                  )}
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleReportClick(review.id)}
                >
                  Report
                </Button>
                {review.reports &&
                  review.reports.length > 0 &&
                  user?.Role === 'Admin' && (
                    <div>
                      <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Reports:
                      </Typography>
                      {review.reports.map((report) => (
                        <Card key={report.id} sx={{ mb: 1 }}>
                          <CardContent>
                            <Typography variant="body1" color="text.secondary">
                              {report.text}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{ mt: 1 }}
                            >
                              Added on{' '}
                              {new Date(report.dateAdded).toLocaleString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
              </CardContent>
            </Card>
            {reportedFeedbackId === review.id && (
              <>
                <Typography variant="body2" sx={{ color: 'red', mb: 2 }}>
                  Reporting review.
                </Typography>
                {showReportForm === review.id && (
                  <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ marginBottom: '1rem' }}
                  >
                    <TextField
                      label="Report Details"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      margin="normal"
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddReport}
                      sx={{ display: 'block', margin: 'auto' }}
                    >
                      Submit Report
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        ))}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default FeedbackPage;
