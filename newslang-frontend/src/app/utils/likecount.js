function CalculateLikeCount(srcRecommend, destRecommend, likeCount) {
  if (destRecommend === "DISLIKE") {
    if (srcRecommend !== "NONE") likeCount--;
  } else if (destRecommend === "LIKE") {
    likeCount++;
  } else if (destRecommend === "NONE" && srcRecommend === "LIKE") {
    likeCount--;
  }
  return likeCount;
}

export default CalculateLikeCount;
