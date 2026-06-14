import React from "react";
import { FeedbackCard, Testimonial } from "./FeedbackCard";
import { Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export function FeedbackSection({ feedbacks }: { feedbacks: Testimonial[] }) {
  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    <section className="px-4 max-w-6xl mx-auto pt-24 pb-12">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest border border-rose-500/20">
          <Heart size={14} /> Student Success Stories
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Don't just take our word for it
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-lg">
          Thousands of students have cracked their dream jobs using our structured learning approach.
        </p>
      </div>

      <div className="w-full relative pb-12 carouselFour">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="w-full pb-10"
        >
          {feedbacks.map((testimonial, idx) => (
            <SwiperSlide key={idx} className="h-auto pb-4">
              <FeedbackCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
