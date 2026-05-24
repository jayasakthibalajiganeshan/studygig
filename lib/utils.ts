import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(
  date: string | Date,
  pattern = "MMM d, yyyy",
): string {
  return format(new Date(date), pattern);
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarUrl(userId: string): string {
  return `https://api.dicebear.com/8.x/notionists/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    writing: "from-amber-500 to-orange-500",
    tutor: "from-blue-500 to-cyan-500",
    student_tutor: "from-purple-500 to-pink-500",
    companion: "from-pink-500 to-rose-500",
    project: "from-indigo-500 to-violet-500",
    craft: "from-green-500 to-teal-500",
    custom: "from-gray-500 to-slate-500",
  };

  return colors[category] || colors.custom;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    writing: "✍️",
    tutor: "🎓",
    student_tutor: "📚",
    companion: "🤝",
    project: "🚀",
    craft: "🎨",
    custom: "⚡",
  };

  return icons[category] || "📌";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    accepted: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    in_progress: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
    review: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
    disputed: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    scheduled: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    live: "text-green-400 bg-green-400/10 border-green-400/20 animate-pulse",
    missed: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return colors[status] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function generateMockId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getXPProgress(xp: number) {
  const level = Math.floor(xp / 1000) + 1;
  const currentXP = xp % 1000;
  const progress = (currentXP / 1000) * 100;

  return {
    level,
    progress,
    currentXP,
    nextLevelXP: 1000,
  };
}

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Commerce",
  "Accountancy",
  "Economics",
  "History",
  "Geography",
  "Political Science",
  "English",
  "Hindi",
  "Computer Science",
  "Data Structures",
  "Algorithms",
  "Web Development",
  "Mobile Development",
  "AI/ML",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Statistics",
  "Calculus",
  "Linear Algebra",
  "Organic Chemistry",
  "Thermodynamics",
  "Mechanics",
];

export const EDUCATION_LEVELS = ["10th", "11th", "12th", "UG", "PG"];

export const PROJECT_TYPES = [
  { value: "web_dev", label: "Web Development", icon: "🌐" },
  { value: "mobile_app", label: "Mobile App", icon: "📱" },
  { value: "ai_ml", label: "AI/ML", icon: "🤖" },
  { value: "iot", label: "IoT", icon: "🔌" },
  { value: "hardware", label: "Hardware", icon: "⚙️" },
  { value: "science", label: "Science Project", icon: "🔬" },
  { value: "craft", label: "Craft", icon: "🎨" },
  { value: "presentation", label: "PPT/Presentation", icon: "📊" },
  { value: "other", label: "Other", icon: "📦" },
];

export const TECH_STACK = [
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Python",
  "FastAPI",
  "Django",
  "Flask",
  "Flutter",
  "React Native",
  "Swift",
  "Kotlin",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Firebase",
  "AWS",
  "GCP",
  "Azure",
  "Docker",
  "Kubernetes",
  "Arduino",
  "Raspberry Pi",
  "MATLAB",
  "R",
];
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
