import {
  AlertTriangle,
  Camera,
  Construction,
  Droplets,
  Lightbulb,
  MapPinned,
  Route,
  ShieldCheck,
  Trash2,
  Waves,
  type LucideIcon,
} from "lucide-react";

export type IssueCategory = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** semantic accent token used for the icon tile */
  tone: "primary" | "warning" | "info" | "danger" | "success";
};

export const issueCategories: IssueCategory[] = [
  {
    id: "pothole",
    label: "Potholes & Road Damage",
    description: "Cracked carriageways, sunken patches and broken surfaces.",
    icon: Construction,
    tone: "warning",
  },
  {
    id: "streetlight",
    label: "Broken Streetlights",
    description: "Dark stretches and faulty poles that reduce night safety.",
    icon: Lightbulb,
    tone: "info",
  },
  {
    id: "water-leak",
    label: "Water Leakage",
    description: "Burst mains and supply leaks wasting treated water.",
    icon: Droplets,
    tone: "info",
  },
  {
    id: "drainage",
    label: "Drainage & Waterlogging",
    description: "Clogged drains and monsoon flooding on local streets.",
    icon: Waves,
    tone: "primary",
  },
  {
    id: "dumping",
    label: "Illegal Dumping",
    description: "Uncollected waste and unauthorised dumping sites.",
    icon: Trash2,
    tone: "success",
  },
  {
    id: "road-hazard",
    label: "Road Hazards",
    description: "Open manholes, debris and other public safety risks.",
    icon: AlertTriangle,
    tone: "danger",
  },
];

export type HowStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const howItWorks: HowStep[] = [
  {
    step: "01",
    title: "Report in seconds",
    description:
      "Snap a photo, describe the problem and drop a pin. No jargon, no forms to hunt through.",
    icon: Camera,
  },
  {
    step: "02",
    title: "AI triages instantly",
    description:
      "Beacon classifies severity, detects duplicates and routes each report to the right department.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    title: "Track to resolution",
    description:
      "Follow a live status timeline with a public tracking code — from acknowledged to resolved.",
    icon: Route,
  },
];

export type ImpactStat = {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  hint: string;
};

export const impactStats: ImpactStat[] = [
  {
    label: "Reports resolved",
    value: 48250,
    suffix: "+",
    hint: "Across 8 divisions nationwide",
  },
  {
    label: "Avg. resolution time",
    value: 3.4,
    decimals: 1,
    suffix: " days",
    hint: "Down from 11 days in 2024",
  },
  {
    label: "Districts live",
    value: 64,
    hint: "Full national coverage",
  },
  {
    label: "Citizen satisfaction",
    value: 92,
    suffix: "%",
    hint: "Post-resolution survey score",
  },
];

export type SuccessStory = {
  id: string;
  category: string;
  location: string;
  title: string;
  summary: string;
  resolvedIn: string;
  department: string;
};

export const successStories: SuccessStory[] = [
  {
    id: "BEA-DHK-4821",
    category: "Drainage",
    location: "Mirpur 10, Dhaka",
    title: "Monsoon waterlogging cleared before rains",
    summary:
      "A recurring flood point flagged by 34 residents was re-graded and de-silted ahead of the season.",
    resolvedIn: "5 days",
    department: "Dhaka North City Corporation",
  },
  {
    id: "BEA-CTG-2907",
    category: "Streetlight",
    location: "Agrabad, Chattogram",
    title: "1.2 km of dark road relit",
    summary:
      "Clustered night-safety reports were merged automatically and fixed in a single maintenance run.",
    resolvedIn: "3 days",
    department: "Chattogram City Corporation",
  },
  {
    id: "BEA-SYL-1150",
    category: "Road damage",
    location: "Zindabazar, Sylhet",
    title: "Highway pothole cluster repaved",
    summary:
      "A severity-critical stretch was prioritised in the queue and resurfaced within the week.",
    resolvedIn: "6 days",
    department: "Roads & Highways Department",
  },
];

export const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
  { label: "Impact", href: "#impact" },
  { label: "Stories", href: "#stories" },
];

/** Approximate hotspots for the stylized hero map (0–100 viewBox space). */
export type MapHotspot = {
  id: string;
  x: number;
  y: number;
  severity: "low" | "medium" | "high";
  label: string;
};

export const heroHotspots: MapHotspot[] = [
  { id: "dhaka", x: 52, y: 46, severity: "high", label: "Dhaka" },
  { id: "chattogram", x: 74, y: 66, severity: "high", label: "Chattogram" },
  { id: "sylhet", x: 78, y: 32, severity: "medium", label: "Sylhet" },
  { id: "rajshahi", x: 30, y: 40, severity: "medium", label: "Rajshahi" },
  { id: "khulna", x: 38, y: 72, severity: "low", label: "Khulna" },
  { id: "rangpur", x: 40, y: 20, severity: "low", label: "Rangpur" },
  { id: "barishal", x: 50, y: 74, severity: "medium", label: "Barishal" },
];

export const toneClasses: Record<
  IssueCategory["tone"],
  { tile: string; icon: string }
> = {
  primary: { tile: "bg-primary/10", icon: "text-primary" },
  warning: { tile: "bg-warning/15", icon: "text-warning" },
  info: { tile: "bg-info/10", icon: "text-info" },
  danger: { tile: "bg-danger/10", icon: "text-danger" },
  success: { tile: "bg-success/10", icon: "text-success" },
};

export { MapPinned };
