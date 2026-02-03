# NeuroMind Lab - Project Blueprint

## 1. Project Overview
*   **Name:** NeuroMind Lab
*   **Goal:** A professional, interactive lecture blog focusing on Brain Science and Psychology.
*   **Target Audience:** Global audience (English).
*   **Core Value:** Making complex scientific concepts accessible through interactive visuals and structured lectures.

## 2. Design Concept & UI/UX
*   **Theme:** "Intellectual & Trustworthy"
    *   **Primary Color:** Deep Navy (`#0f172a`) - Represents depth and knowledge.
    *   **Secondary Color:** Clean White (`#ffffff`) - For readability and clarity.
    *   **Accent Color:** Electric Blue (`#38bdf8`) or Soft Gold - For interactive elements and buttons.
*   **Typography:** Modern Sans-Serif (e.g., 'Pretendard', Inter, or system fonts) for clean readability.
*   **Layout:** Responsive grid system (Mobile-first).

## 3. Key Features & Implementation Plan

### Phase 1: MVP (Minimum Viable Product)
1.  **Landing Page (`index.html`):**
    *   **Hero Section:** "Journey to explore my brain and mind".
    *   **Interactive Brain Map:** A visual section where users click on brain regions (Frontal Lobe, Hippocampus, etc.) to see a modal/card with its function.
    *   **Recent Lectures:** A grid of latest blog posts with attractive thumbnails.
    *   **Psychology Test:** "Stress Self-Assessment" with immediate results.

2.  **Lecture Structure:**
    *   Dedicated section for "Brain Science" and "Psychology".
    *   Clean reading interface with "Dark Mode" toggle.

3.  **Tech Stack:**
    *   HTML5 (Semantic)
    *   CSS3 (Variables, Flexbox/Grid, Animations)
    *   JavaScript (ES6+ for interactivity)

## 4. Content Strategy (Examples)
*   **Brain Science:** "How Dopamine Controls You: The Science of Craving," "The Science of Sleep."
*   **Psychology:** "Confirmation Bias: Why Your Brain Loves Being Right (and How to Fight It)," "Are You a Modern Pavlov's Dog? The Science of Being Trained."

## 5. Current Task: Content Enhancement
*   **COMPLETED:** Enhance lecture content with more detail and engaging writing.
*   **COMPLETED:** Add relevant, high-quality images to each lecture.
*   **COMPLETED:** Integrate Disqus for comments on lecture detail pages.

## 6. Recent Changes (Feb 3, 2026)
*   **Content Restructuring for Readability ("Less Plain Text"):**
    *   **lecture-dopamine.html:** Overhauled with new sections on dopamine pathways, the "molecule of more," the cost of cheap dopamine, and an action plan. Added new images. Implemented "Key Takeaways" section, broke down long paragraphs, enhanced visual clarity of the "Dopamine Feedback Loop" text, and added a bold introductory statement for better engagement.
    *   **lecture-pavlov.html:** Expanded to include the "Little Albert" experiment, modern applications in advertising and therapy, and a "retrain your brain" section. Added new images. Implemented "Key Takeaways" section, broke down long paragraphs, and added a bold introductory statement for better engagement.
    *   **lecture-confirmation-bias.html:** Deepened the explanation with the "three filters" of bias, real-world consequences, and a practical guide to counteracting the bias. Added new images. Implemented "Key Takeaways" section, broke down long paragraphs, and added bold introductory statements to key sections for better engagement and flow.
*   **Article Design Improvements:**
    *   Moved all inline article-specific styles from HTML files to a new `article.css`.
    *   Improved color contrast and readability, especially for dark mode.
    *   Refined typography (line height, heading styles) and list styling for better visual hierarchy.
    *   Ensured consistent and professional look across all lecture pages.
