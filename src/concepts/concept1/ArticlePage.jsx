import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getArticleById } from '../../data/content';
import EditorialArticle from './articles/EditorialArticle';
import MediaArticle from './articles/MediaArticle';
import InsightArticle from './articles/InsightArticle';

const TEMPLATE_MAP = {
  editorial: EditorialArticle,
  media: MediaArticle,
  insight: InsightArticle,
};

export default function ArticlePage() {
  const { articleId } = useParams();
  const article = getArticleById(articleId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  if (!article) {
    return <Navigate to="/concept-1" replace />;
  }

  const Template = TEMPLATE_MAP[article.template] || EditorialArticle;
  return <Template article={article} />;
}
