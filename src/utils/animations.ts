export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export const hoverCard = {
  hover: {
    y: -6,
    scale: 1.01,
    boxShadow: "0 20px 40px -15px rgba(70, 95, 255, 0.12)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};
