import type { Masterclass } from "@/types/masterclass";
import MasterclassHeader from "./MasterclassHeader";
import MasterclassHero from "./MasterclassHero";
import PlacementsSection from "./PlacementsSection";
import AudienceSection from "./AudienceSection";
import OutcomesSection from "./OutcomesSection";
import CurriculumSection from "./CurriculumSection";
import ReviewsSection from "./ReviewsSection";
import FaqSection from "./FaqSection";
import InstructorSection from "./InstructorSection";
import StickyCtaBar from "./StickyCtaBar";
import AppFooter from "@/layout/AppFooter";

// scroll-mt keeps anchored sections clear of the fixed header.
const anchor = "scroll-mt-24";

export default function MasterclassDetail({ masterclass }: { masterclass: Masterclass }) {
  return (
    <div className="min-h-screen w-full bg-gray-50/50 pb-20 dark:bg-[#0B0F19]">
      <MasterclassHeader cta={masterclass.stickyBar.cta} />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 md:pb-16">
        <div className="mb-12">
          <MasterclassHero hero={masterclass.hero} />
        </div>

        <div id="success-stories" className={anchor}>
          <PlacementsSection placements={masterclass.placements} />
        </div>

        <div id="who-is-it-for" className={anchor}>
          <AudienceSection audience={masterclass.audience} />
        </div>

        <div id="outcomes" className={anchor}>
          <OutcomesSection outcomes={masterclass.outcomes} />
        </div>

        <div id="curriculum" className={anchor}>
          <CurriculumSection curriculum={masterclass.curriculum} />
        </div>

        <div id="instructor" className={anchor}>
          <InstructorSection instructor={masterclass.instructor} />
        </div>

        <div id="reviews" className={anchor}>
          <ReviewsSection reviews={masterclass.reviews} />
        </div>

        <div id="faq" className={anchor}>
          <FaqSection faq={masterclass.faq} />
        </div>
      </main>

      <AppFooter />

      <StickyCtaBar bar={masterclass.stickyBar} />
    </div>
  );
}
