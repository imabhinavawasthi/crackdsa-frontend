# CrackDSA Frontend

Welcome to the frontend repository for **CrackDSA** — an adaptive, AI-driven learning portal designed to help students master Data Structures and Algorithms. Generates personalized study tracks, provides progress charts, dynamic practice tags, live masterclass schedules, and custom practice sheets.

## 🚀 Key Features

- **Personalized DSA Roadmap**: Generates custom roadmaps based on the user's timeline, target companies, and strength levels.
- **Interactive Syllabus & Course Tracker**: Sleek dashboard for lectures, topic verification, and video player with custom timestamps.
- **Dynamic Practice Catalog**: Filter problems by tags, companies, difficulty levels, and bookmark them.
- **Streak Tracker & Progress Visualizers**: Keep track of daily active streaks and topic masteries with interactive ApexCharts.
- **Community Forum**: Discussion boards for DSA doubts and peer interactions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management / UI**: Radix UI (Popover, Dialog, Dropdown), Framer Motion
- **Utilities**: ApexCharts, Swiper.js, jsPDF

## 💻 Getting Started

### Prerequisites

Ensure you have **Node.js 22.x** or higher installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nikhil3495/crackdsa-frontend.git
   cd crackdsa-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the following keys:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_GOOGLE_AUTH_URL=https://<supabase-project-id>.supabase.co/auth/v1/authorize?provider=google&access_type=offline&prompt=consent
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_<your_key_id>
   ```

### Running Locally

To start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### Linting and Formatting

To lint the code and scan for errors:
```bash
npm run lint
```

### Running Unit Tests

To run the utility unit tests using the native Node.js test runner:
```bash
node --experimental-strip-types src/utils/string.test.ts
```
