import ResponseArticle from "./ResponseAritcle";

type ResponseArticleThumbnail = Pick<
  ResponseArticle,
  | "userId"
  | "department"
  | "nickname"
  | "isAnonymous"
  | "articleId"
  | "title"
  | "content"
  | "createAt"
  | "updatedAt"
  | "commentNum"
  | "likeNum"
  | "isLiked"
  | 'userImageUrl'
>;

export default ResponseArticleThumbnail