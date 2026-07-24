import {
  AlertTriangle,
  Camera,
  CircleHelp,
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
  {
    id: "other",
    label: "Other",
    description: "Any civic infrastructure problem not listed above.",
    icon: CircleHelp,
    tone: "primary",
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

export const navLinks = [
  { label: "Report", href: "#report" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
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
