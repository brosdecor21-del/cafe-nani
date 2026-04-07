import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={star <= rating ? 'star-filled fill-current' : 'star-empty'}
      />
    ))}
  </div>
);

const ReviewCard = ({ review, index, language }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white p-6 rounded-sm border border-[#E5E0D8] min-w-[300px] md:min-w-[350px]"
  >
    <Quote size={24} className="text-[#C07D5A]/30 mb-4" />
    <p className="text-[#2C2420]/80 text-sm leading-relaxed mb-4">
      "{language === 'hu' ? review.text_hu : review.text_en}"
    </p>
    <div className="flex items-center justify-between">
      <span className="font-medium text-[#1A1614]">{review.author}</span>
      <StarRating rating={review.rating} />
    </div>
  </motion.div>
);

const ReviewsSection = () => {
  const { t, language } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        // Fallback reviews
        setReviews([
          {
            id: '1',
            author: 'Kovács Anna',
            text_hu: 'Nagyon finom V60 kávé, kedves kiszolgálás. A hely hangulata fantasztikus!',
            text_en: 'Very delicious V60 coffee, friendly service. The atmosphere is fantastic!',
            rating: 5,
          },
          {
            id: '2',
            author: 'Nagy Péter',
            text_hu: 'Dirty chai finom volt, barátságos hangulat. Mindig szívesen jövök ide.',
            text_en: 'Dirty chai was delicious, friendly atmosphere. I always love coming here.',
            rating: 5,
          },
          {
            id: '3',
            author: 'Szabó Eszter',
            text_hu: 'Hangulatos hely, nagy választék. A flat white tökéletes volt!',
            text_en: 'Cozy place, great selection. The flat white was perfect!',
            rating: 5,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  return (
    <section className="py-24 bg-[#F5F0E8]" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="overline mb-4">{t('reviews.title')}</p>
          <div className="flex items-center justify-center gap-4">
            <span className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-[#1A1614]">
              {averageRating}
            </span>
            <div className="text-left">
              <StarRating rating={Math.round(parseFloat(averageRating))} />
              <p className="text-sm text-[#2C2420]/60 mt-1">
                {t('reviews.basedOn')} {reviews.length || 69} {t('reviews.rating')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Scroll */}
        <div className="overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-6" data-testid="reviews-container">
            {loading ? (
              <div className="text-center py-8 text-[#2C2420]/60 w-full">
                {t('common.loading')}
              </div>
            ) : (
              reviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index}
                  language={language}
                />
              ))
            )}
          </div>
        </div>

        {/* Google rating badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-[#2C2420]/60">
            ★ 4.8 Google {t('reviews.rating')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
