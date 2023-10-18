export const calcAvgRating = (activity) => {
  return (
    activity.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
    activity.ratings.length
  );
};
