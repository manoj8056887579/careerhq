"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { BlogSlider } from "../components/blog-ticker";

import { Grid } from "../components/ui/feature-section";
import { EnquiryForm, EnquiryFormHandle } from "../components/enquiry-form";

import { BlogCard } from "../components/blog-card";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";
import { HeroVideoDialog } from "../components/hero-video-dialog";
import { AnimatedTooltip } from "../components/ui/animated-tooltip";
import { ColourfulText } from "../components/ui/colourful-text";
import VenomBeam from "../components/ui/venom-beam";
import { AnimatedLogosCanopy } from "../components/ui/animated-logos-canopy";
import type { BlogPost } from "@/types/blog";
import type { CountryWithCounts, University } from "@/types/education";
import { getImageUrl as getCloudinaryImageUrl } from "@/lib/cloudinary-utils";
import {
  logDataFetchError,
  logNetworkError,
  logApiError,
} from "@/utils/errorUtils";

interface HomePageClientProps {
  blogPosts: BlogPost[];
}

export function HomePageClient({ blogPosts }: HomePageClientProps) {
  const enquiryRef = React.useRef<EnquiryFormHandle | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [countries, setCountries] = React.useState<CountryWithCounts[]>([]);
  const [_universities, setUniversities] = React.useState<University[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoaded(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch countries and universities in parallel
      const [countriesRes, universitiesRes] = await Promise.all([
        fetch("/api/countries?includeCounts=true"),
        fetch("/api/universities?populate=true&limit=8"),
      ]);

      // Check countries response
      if (!countriesRes.ok) {
        logApiError(
          `Failed to fetch countries for homepage: ${countriesRes.status}`,
          "/api/countries",
          { includeCounts: true },
          countriesRes.status
        );
      }

      // Check universities response
      if (!universitiesRes.ok) {
        logApiError(
          `Failed to fetch universities for homepage: ${universitiesRes.status}`,
          "/api/universities",
          { populate: true, limit: 8 },
          universitiesRes.status
        );
      }

      const [countriesData, universitiesData] = await Promise.all([
        countriesRes.ok ? countriesRes.json() : { countries: [] },
        universitiesRes.ok ? universitiesRes.json() : { universities: [] },
      ]);

      // Set countries data (limit to top 4 for homepage)
      if (countriesData.countries) {
        setCountries(countriesData.countries);
      }

      // Set universities data
      if (universitiesData.universities) {
        setUniversities(universitiesData.universities);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        logNetworkError(error, "/api/countries or /api/universities", {
          countriesParams: { includeCounts: true },
          universitiesParams: { populate: true, limit: 8 },
        });
      } else {
        logDataFetchError(
          error instanceof Error ? error : String(error),
          "homepage_data",
          undefined,
          {
            countriesParams: { includeCounts: true },
            universitiesParams: { populate: true, limit: 8 },
          }
        );
      }
      // Keep empty arrays as fallback
    } finally {
      setLoading(false);
    }
  };

  // Data is now fetched from APIs in useEffect

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "CSE, SSN College of Engineering",
      content:
        "SSN's placement cell connected me with top recruiters; I landed a software role at a unicorn and my coding skills grew fast.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Mechanical Engg, VIT (Vellore Institute of Technology)",
      content:
        "VIT's industry-driven curriculum and internship support helped me secure a summer internship that turned into a job offer.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Emily Chen",
      role: "Data Science, Deakin University",
      content:
        "Deakin's industry-aligned curriculum helped me secure a Data Analyst internship that quickly became a full-time role.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Liam Patel",
      role: "Computer Science, AUT — Auckland University of Technology",
      content:
        "AUT's industry-focused teaching and co-op placements opened the door to my first tech job in Auckland.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Civil Engineering, Griffith University",
      content:
        "Griffith's close industry ties helped me earn a paid internship that led to a full-time engineering position.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Anika Müller",
      role: "Data Science, IU – International University of Applied Sciences",
      content:
        "IU's practical curriculum and flexible study modes helped me gain real industry experience in Germany.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "David Schmidt",
      role: "MBA, Berlin School of Business & Innovation (BSBI)",
      content:
        "BSBI's business-focused teaching and networking events helped me land an internship in Berlin.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Cybersecurity, University of New Haven (USA)",
      content:
        "UNH's practical labs and career workshops helped me secure a cybersecurity internship within months.",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Sophie Martin",
      role: "Computer Science, University of Alberta (Canada)",
      content:
        "UAlberta's world-class labs and research culture helped me contribute to impactful engineering projects.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Management, Durham University (UK)",
      content:
        "Durham's rigorous coursework and academic excellence prepared me for a consulting role in the UK.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Aoife O'Connor",
      role: "Computer Science, Trinity College Dublin (Ireland)",
      content:
        "TCD's research-led teaching and strong tech ecosystem helped me secure a role in Ireland's tech industry.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Pierre Dubois",
      role: "Global MBA, NEOMA Business School (Paris)",
      content:
        "NEOMA's global curriculum and case-study approach prepared me for real corporate challenges.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Ananya Reddy",
      role: "ECE, SSN College of Engineering",
      content:
        "Campus life at SSN balanced academics and clubs perfectly — faculty mentorship made a real difference in projects.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Arjun Menon",
      role: "IT, VIT (Vellore Institute of Technology)",
      content:
        "The global peer group and active placement team gave me confidence to interview with multinational companies.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Vikram Singh",
      role: "Civil Engg, SRM Institute of Science & Technology",
      content:
        "SRM's placement coaching and mock interviews were game-changers — I cleared multiple rounds and joined a large MNC.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Meera Krishnan",
      role: "Biotechnology, SRM Institute of Science & Technology",
      content:
        "Excellent lab facilities and supportive faculty helped me publish my first research paper during my final year.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Dr. Aditya Iyer",
      role: "Medicine, SRM Ramachandra",
      content:
        "Clinical exposure and experienced faculty at Ramachandra prepared me exceptionally well for hospital work.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Kavya Nair",
      role: "Allied Health, SRM Ramachandra",
      content:
        "Hands-on training and industry collaborations led directly to my placement in a leading healthcare organisation.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Karthik Ramesh",
      role: "Electronics, Sathyabama Institute of Science and Technology",
      content:
        "Sathyabama's project-driven labs gave me the portfolio I needed to impress recruiters.",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Divya Subramanian",
      role: "IT, Sathyabama Institute of Science and Technology",
      content:
        "Placement teams arranged campus drives with reputable firms — the process was well-organised and supportive.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Dr. Sneha Pillai",
      role: "Dentistry, Saveetha Institute",
      content:
        "Clinical training at Saveetha was rigorous and practical — it boosted my confidence in patient care.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Rohan Gupta",
      role: "Biomedical, Saveetha Institute",
      content:
        "Strong faculty guidance helped me secure a research assistant position during my studies.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Arun Xavier",
      role: "Commerce, Loyola College",
      content:
        "Loyola's emphasis on ethics and soft skills made me a better communicator at interviews; I joined a consumer-tech firm after graduation.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Maria Joseph",
      role: "Visual Communication, Loyola College",
      content:
        "Active alumni network opened doors for mentoring and placements.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Siddharth Bose",
      role: "Computer Science, Amrita Vishwa Vidyapeetham",
      content:
        "Amrita's research culture and collaboration with industry helped me land a role in AI research.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Lakshmi Venkat",
      role: "Electrical Engg, Amrita Vishwa Vidyapeetham",
      content:
        "Holistic education, strong labs and experienced faculty — great foundation for my career in engineering.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Naveen Kumar",
      role: "Mechanical Engg, PSG College of Technology",
      content:
        "PSG's corporate connections and robust placement training helped me receive multiple offers.",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Deepika Rajan",
      role: "Mechatronics, PSG College of Technology",
      content:
        "Excellent hands-on workshops and industry projects made me job-ready.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Harish Balaji",
      role: "Computer Science, Rajalakshmi Engineering College",
      content:
        "Rajalakshmi's focused placement drives and soft-skill sessions helped me secure a role in product engineering.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Pooja Sundaram",
      role: "ECE, Rajalakshmi Engineering College",
      content:
        "Supportive faculty guided me through internships that turned into full-time offers.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Ashwin Prakash",
      role: "CSE, Kumaraguru College of Technology",
      content:
        "Kumaraguru's emphasis on practical learning and entrepreneurship helped me launch a startup post-graduation.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Nithya Mohan",
      role: "IT, Kumaraguru College of Technology",
      content:
        "Placement cell was proactive; the mock interviews built my confidence.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Samuel David",
      role: "Biotechnology, Karunya Institute of Technology and Sciences",
      content:
        "Karunya's ethical values and industry-focused curriculum made me a well-rounded engineer.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Grace Thomas",
      role: "Chemical Engg, Karunya Institute of Technology and Sciences",
      content:
        "Strong lab facilities and internship pipelines helped me secure a research role.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Oliver Thompson",
      role: "Engineering, Deakin University",
      content:
        "Hands-on labs and supportive faculty strengthened my research skills and boosted my confidence in global interviews.",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Jack Anderson",
      role: "IT, Charles Sturt University",
      content:
        "CSU's practical modules and flexible learning helped me land a cyber security role soon after graduation.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Emma Williams",
      role: "Business Analytics, Charles Sturt University",
      content:
        "Personalised faculty guidance made my academic and career journey smooth and impactful.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Aria Singh",
      role: "Design Technology, AUT — Auckland University of Technology",
      content:
        "A multicultural environment and excellent labs helped me build a strong creative portfolio.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Isabella Brown",
      role: "Health Sciences, Flinders University",
      content:
        "Flinders' internship pathways and hands-on training directly helped me secure a role in the healthcare sector.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Noah Davis",
      role: "Biotechnology, Flinders University",
      content:
        "Friendly faculty and strong research facilities made project work meaningful and career-focused.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Chloe Taylor",
      role: "Business, Griffith University",
      content:
        "Excellent campus support and global exposure prepared me well for competitive business roles.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Lucas Mitchell",
      role: "Mechanical Engg, The University of Newcastle (Australia)",
      content:
        "Newcastle's research-driven learning gave me the technical depth to join an international engineering firm.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Mia Roberts",
      role: "IT, The University of Newcastle (Australia)",
      content:
        "Career services guided me through every interview step until I secured a graduate position.",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Lars Weber",
      role: "Business Management, IU – International University of Applied Sciences",
      content:
        "Career-focused modules helped me secure a working student role within the first semester.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Hannah Fischer",
      role: "Marketing, Berlin School of Business & Innovation (BSBI)",
      content:
        "Their career guidance and international community opened doors to opportunities across Europe.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Ryan Lee",
      role: "IT, EDU International (Adelaide)",
      content:
        "Practical training sessions and faculty mentorship helped me build strong skills and secure my placement.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Zoe Campbell",
      role: "Business, EDU International (Adelaide)",
      content:
        "Supportive staff and well-structured internships made my transition into the workforce smooth.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Erik Andersson",
      role: "Entrepreneurship, Jönköping University (Sweden)",
      content:
        "The startup-driven ecosystem at Jönköping helped me co-found a student-led venture during my course.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Sofia Larsson",
      role: "Engineering, Jönköping University (Sweden)",
      content:
        "Strong industry collaboration opened up multiple internship pathways across Europe.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Camille Laurent",
      role: "Marketing, NEOMA Business School (Paris)",
      content:
        "Their alumni network and career support guided me toward a role in a multinational firm.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Jessica Martinez",
      role: "Forensic Science, University of New Haven (USA)",
      content:
        "Faculty mentorship and research opportunities strengthened my profile for competitive roles.",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Ethan MacDonald",
      role: "Engineering, University of Alberta (Canada)",
      content:
        "Co-op programs and career fairs made it easier to connect with top recruiters.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Charlotte Smith",
      role: "Economics, Durham University (UK)",
      content:
        "The college system and mentorship helped me grow personally and professionally.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Conor Murphy",
      role: "Business Analytics, Trinity College Dublin (Ireland)",
      content:
        "Great campus culture and well-structured internships strengthened my global career profile.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
  ];

  const services = [
    {
      title: "University Selection",
      description:
        "Get expert guidance on choosing the right university based on your academic profile, career goals, and preferences.",
      icon: "lucide:building",
    },
    {
      title: "Visa Assistance",
      description:
        "Navigate the complex visa application process with our step-by-step guidance and documentation support.",
      icon: "lucide:file-check",
    },
    {
      title: "Scholarship Guidance",
      description:
        "Discover and apply for scholarships that match your profile to make your education more affordable.",
      icon: "lucide:award",
    },
    {
      title: "Application Support",
      description:
        "Get comprehensive assistance with university applications, including SOP, LOR, and resume preparation.",
      icon: "lucide:clipboard-check",
    },
    {
      title: "Test Preparation",
      description:
        "Access resources and guidance for standardized tests like IELTS, TOEFL, GRE, GMAT, and more.",
      icon: "lucide:book-open",
    },
    {
      title: "Career Counseling",
      description:
        "Receive personalized career counseling to align your education with your long-term professional goals.",
      icon: "lucide:briefcase",
    },
    {
      title: "Student Accommodation",
      description:
        "Find safe and comfortable accommodation options near your university with our housing assistance service.",
      icon: "lucide:home",
    },
    {
      title: "Cultural Integration",
      description:
        "Get support for adapting to your new environment with cultural orientation and local community connections.",
      icon: "lucide:globe",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Students Placed", icon: "lucide:users" },
    { value: "95%", label: "Visa Success Rate", icon: "lucide:check-circle" },
    { value: "500+", label: "University Partners", icon: "lucide:building" },
    { value: "50+", label: "Countries Covered", icon: "lucide:globe" },
  ];

  // Convert blog posts to ticker format
  const blogTickerItems = blogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    link: `/blog/${post.id}`,
    isActive: false,
  }));

  return (
    <>
      {/* Hero Section */}
      <VenomBeam className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-400">
                  Your Gateway to <ColourfulText text="Global Career" />
                </h1>
                <p className="text-xl text-neutral-700 dark:text-neutral-300 mb-8">
                  Your one-stop platform to explore global opportunities, build
                  skills, and achieve success across borders.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <Link href="/about">
                    {" "}
                    <Button
                      color="primary"
                      size="lg"
                      endContent={<Icon icon="lucide:arrow-right" />}
                      className="font-medium"
                    >
                      Learn More
                    </Button>{" "}
                  </Link>
                  <Button
                    color="primary"
                    variant="flat"
                    size="lg"
                    startContent={<Icon icon="lucide:calendar" />}
                    className="font-medium"
                    onPress={() =>
                      enquiryRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      })
                    }
                  >
                    Free Consultation
                  </Button>
                </div>

                <div className="flex items-center justify-start gap-2 mb-8">
                  <p className="text-sm text-foreground-500 mr-4 hidden md:block">
                    Popular Destinations:
                  </p>
                  {!loading && countries.length > 0 && (
                    <AnimatedTooltip
                      items={countries.map((country, index) => ({
                        id: index + 1,
                        name: country.name,
                        designation: `${
                          country.universities || 0
                        } Universities • ${country.courses || 0} Courses`,
                        image: country.flagImageId
                          ? getCloudinaryImageUrl(
                              country.flagImageId,
                              "thumbnail"
                            )
                          : ``,
                      }))}
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Icon icon={stat.icon} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{stat.value}</p>
                        <p className="text-xs text-foreground-500">
                          {stat.label}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="relative z-10">
                <HeroVideoDialog
                  videoSrc="https://www.youtube.com/embed/t5akgsQsOSk?si=zke8LcRhw_75zT4X"
                  thumbnailSrc="https://www.timeshighereducation.com/student/sites/default/files/harvard-university-campus.jpg"
                  thumbnailAlt="Watch our welcome video"
                  animationStyle="from-center"
                  className="w-full rounded-lg shadow-xl overflow-hidden aspect-video"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-100 rounded-full blur-2xl opacity-60 z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full blur-2xl opacity-60 z-0"></div>
            </motion.div>
          </div>

          {/* <div className="mt-12 md:mt-16">
            <SearchBar variant="hero" />
          </div> */}

          {blogTickerItems && blogTickerItems.length > 0 && (
            <div className="mt-14">
              <BlogSlider items={blogTickerItems} />
            </div>
          )}
        </div>
      </VenomBeam>

      {/* Explore Our Verticals Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Explore Our Verticals
            </h2>
            <p className="text-foreground-600 max-w-2xl mx-auto text-lg">
              Discover opportunities across education, placements, internships,
              and more
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {[
              {
                type: "study-abroad",
                name: "Study Abroad",
                icon: "lucide:book-open",
                color: "from-red-500 to-red-600",
                bgColor: "bg-red-50",
                iconColor: "text-red-600",
              },
              {
                type: "study-india",
                name: "Study India",
                icon: "lucide:graduation-cap",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                type: "placement-india",
                name: "Placement India",
                icon: "lucide:briefcase",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
                iconColor: "text-green-600",
              },
              {
                type: "placement-abroad",
                name: "Placement Abroad",
                icon: "lucide:plane",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                iconColor: "text-purple-600",
              },
              {
                type: "internship-india",
                name: "Internship India",
                icon: "lucide:users",
                color: "from-orange-500 to-orange-600",
                bgColor: "bg-orange-50",
                iconColor: "text-orange-600",
              },
              {
                type: "internship-abroad",
                name: "Internship Abroad",
                icon: "lucide:globe",
                color: "from-cyan-500 to-cyan-600",
                bgColor: "bg-cyan-50",
                iconColor: "text-cyan-600",
              },
              {
                type: "mbbs-india",
                name: "MBBS India",
                icon: "lucide:stethoscope",
                color: "from-red-500 to-red-600",
                bgColor: "bg-red-50",
                iconColor: "text-red-600",
              },
              {
                type: "mbbs-abroad",
                name: "MBBS Abroad",
                icon: "lucide:heart-pulse",
                color: "from-pink-500 to-pink-600",
                bgColor: "bg-pink-50",
                iconColor: "text-pink-600",
              },
              {
                type: "lms",
                name: "LMS",
                icon: "lucide:book-open",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                type: "uni-project",
                name: "University Projects",
                icon: "lucide:flask-conical",
                color: "from-teal-500 to-teal-600",
                bgColor: "bg-teal-50",
                iconColor: "text-teal-600",
              },
              {
                type: "school-project",
                name: "School Projects",
                icon: "lucide:book-open",
                color: "from-amber-500 to-amber-600",
                bgColor: "bg-amber-50",
                iconColor: "text-amber-600",
              },
              // {
              //   type: "mou-project",
              //   name: "MOU Projects",
              //   icon: "lucide:handshake",
              //   color: "from-violet-500 to-violet-600",
              //   bgColor: "bg-violet-50",
              //   iconColor: "text-violet-600",
              // },
              {
                type: "loans",
                name: "Education Loans",
                icon: "lucide:wallet",
                color: "from-emerald-500 to-emerald-600",
                bgColor: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
            ].map((vertical, index) => (
              <motion.div
                key={vertical.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href={`/${vertical.type}`}>
                  <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100 h-full flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 rounded-xl ${vertical.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        icon={vertical.icon}
                        className={`w-8 h-8 ${vertical.iconColor}`}
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-secondary-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {vertical.name}
                    </h3>
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20  bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-foreground-600 max-w-2xl mx-auto text-lg">
              Discover your path to success, where worldwide careers meet at one
              dot .
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <Grid size={20} />
                <div className="relative z-20 mb-6 transform transition-transform group-hover:scale-110 duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-800/30 flex items-center justify-center">
                    <Icon
                      icon={service.icon}
                      className="h-6 w-6 text-primary-600 dark:text-primary-400"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 relative z-20 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base font-normal relative z-20 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Connecting worldwide career in one dot{" "}
              </h2>
              <p className="text-white/90 mb-6">
                One destination, countless opportunities – where worldwide
                careers meet at one dot .
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/career-test">
                  <Button
                    color="default"
                    variant="solid"
                    size="lg"
                    startContent={<Icon icon="lucide:calendar" />}
                    className="font-medium bg-white text-primary"
                  >
                    Begin Test
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="bordered"
                    size="lg"
                    className="font-medium text-white border-white"
                  >
                    Learn More About Us
                  </Button>{" "}
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <EnquiryForm
                ref={enquiryRef}
                title="Get Started Today"
                subtitle="Fill out this form and our experts will get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
              radial-gradient(circle 500px at 20% 80%, rgba(59,130,246,0.3), transparent),
              radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)
            `,
            backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Student Success Stories</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Hear from our students who have successfully achieved their career
              goals with our guidance.
            </p>
          </div>

          <AnimatedTestimonials
            data={testimonials}
            className="py-8"
            cardClassName="bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm"
          />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest from Our Blog</h2>
              <p className="text-foreground-500">
                Insights and guides for international students
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  imageId={post.imageId}
                  date={post.date}
                  author={post.author}
                  category={post.category}
                  readTime={post.readTime || "5 min read"}
                />
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-foreground-500 mb-4">
                  No blog posts available at the moment.
                </p>
              </div>
            )}
          </div>
          {blogPosts.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/blog">
                {" "}
                <Button
                  variant="flat"
                  color="primary"
                  endContent={<Icon icon="lucide:arrow-right" />}
                  className="mt-4 md:mt-0"
                >
                  View All Articles
                </Button>{" "}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our University Partners</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              We collaborate with leading universities and institutions
              worldwide to provide you with the best opportunities.
            </p>
          </div>

          <AnimatedLogosCanopy
            data={[
              {
                name: "Berlin School of Business and Innovation (BSBI), Germany",
                logo: "/images/university-partners/Berlin School of Business and Innovation (BSBI), Germany.png",
              },
              {
                name: "Durham University, UK",
                logo: "/images/university-partners/Durham University, UK.png",
              },
              {
                name: "Edu International, Adelaide, Australia",
                logo: "/images/university-partners/Edu International, Adelaide, Australia.png",
              },
              {
                name: "International University of Applied Sciences, Germany",
                logo: "/images/university-partners/International University of Applied Sciences, Germany.png",
              },
              {
                name: "Jonkoping University, Sweden",
                logo: "/images/university-partners/Jonkoping University, Sweden.png",
              },
              {
                name: "NEOMA Business School, Paris, France",
                logo: "/images/university-partners/NEOMA Business School, Paris, France.png",
              },
              {
                name: "Trinity College Dublin (TCD), Ireland",
                logo: "/images/university-partners/Trinity College Dublin (TCD), Ireland.png",
              },
              {
                name: "University of Alberta, Canada",
                logo: "/images/university-partners/University of Alberta, Canada.png",
              },
              {
                name: "University of New Haven, Connecticut, USA",
                logo: "/images/university-partners/University of New Haven, Connecticut, USA.png",
              },
            ]}
            className="py-8"
            cardClassName="bg-white/90 dark:bg-gray-800/90"
            repeat={4}
          />
        </div>
      </section>
    </>
  );
}
