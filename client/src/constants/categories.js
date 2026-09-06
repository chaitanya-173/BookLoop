import { GraduationCap, BookOpen, Trophy, Library, Laptop } from "lucide-react";

export const CATEGORIES = [
  {
    name: "School",
    icon: GraduationCap,
    desc: "Class 1–12, board prep & school essentials",
    options: ["Class 12", "Class 11", "Class 10", "Class 9", "Class 1-8", "Others"],
  },
  {
    name: "College / University",
    icon: Library,
    desc: "Degree, diploma & higher education books",
    options: [
      "B.A", "B.Com", "B.Sc", "B.Tech", "BCA", "BBA", "LLB", "MBBS",
      "M.A", "M.Com", "M.Sc", "M.Tech", "MCA", "MBA", "MD/MS", "LLM",
      "Certificate", "Diploma", "MPhil/PhD", "Other",
    ],
  },
  {
    name: "Entrance / Competitive",
    icon: Trophy,
    desc: "JEE, NEET, UPSC, SSC & exam prep",
    options: [
      "IIT JEE", "NEET", "UPSC", "SSC", "GATE", "NDA", "CAT", "CUET",
      "BITSAT", "CLAT", "State PCS", "IELTS/TOEFL", "Other",
    ],
  },
  {
    name: "Fiction",
    icon: BookOpen,
    desc: "Novels, fantasy, thrillers & literature",
    options: [
      "Novels", "Manga", "Children Books", "Picture Books", "Romance",
      "Fantasy", "Science Fiction", "Mystery", "Horror", "Thriller",
      "Action & Adventure", "Young Adult", "Historical Fiction",
    ],
  },
  {
    name: "Non-fiction",
    icon: BookOpen,
    desc: "Self-help, business, biographies & more",
    options: [
      "Self-help", "Biographies", "Business & Finance", "Health",
      "History & Humanities", "Language Learning", "Lifestyle",
      "Cooking Food & Wine", "Music", "Personal & Social Issues",
      "Religion", "Sports", "Travel", "Dictionary", "Encyclopedia",
    ],
  },
  {
    name: "Others",
    icon: Laptop,
    desc: "Computer science, design, niche subjects",
    options: ["Agriculture", "Architecture", "Art & Photography", "Computer Science", "Other"],
  },
];