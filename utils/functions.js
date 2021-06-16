const averageRating = (ratingsObjectArray) => {
  const ratingsObjectArrayLength = ratingsObjectArray.length
  const numericRatingsArray = ratingsObjectArray.map(review => review.rating)
  const sumOfAllNumericRatings = numericRatingsArray.reduce((acc, rating) => acc + rating, 0)
  const highestRatingValue = ratingsObjectArrayLength * 5
  const averageResult = (sumOfAllNumericRatings * 5) / highestRatingValue

  return averageResult
}

module.exports = {
  averageRating
}
