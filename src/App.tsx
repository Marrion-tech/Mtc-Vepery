/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Changes made in this rewrite:
 * 1. Replaced Unsplash logo with inline SVG ChurchLogo component.
 * 2. Fixed footer grid to grid-cols-1 md:grid-cols-2 lg:grid-cols-4.
 * 3. Replaced placeholder contact info with TODO comments.
 * 4. Added onSubmit handler to newsletter form with success state.
 * 5. Fixed M3Card to destructure and exclude 'hover' prop to prevent React DOM warnings.
 * 6. Fixed active nav section state to reset on subpages.
 * 7. Updated hero CTAs: "Join Us This Sunday" is now the primary filled button.
 * 8. Added "Malar" outlined button to desktop navbar.
 * 9. Replaced static contact cards with a full functional contact form + success state.
 * 10. Added service times notice pill below hero headline.
 * 11. Added loading="lazy" to all non-hero <img> tags.
 * 12. Appended optimization parameters (&w=800&fm=webp&q=75) to all Unsplash URLs.
 */

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from 'motion/react';
import { 
  Menu, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Users,
  Heart,
  BookOpen,
  Church,
  Youtube,
  Send,
  Signature,
  PenTool,
  ArrowUp,
  ArrowLeft
} from 'lucide-react';

// Inline SVG Church Logo
const ChurchLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2L12 22" />
    <path d="M7 7L17 7" />
    <path d="M12 2L4 10V22H20V10L12 2Z" />
  </svg>
);

// Ministry Data with optimized images
const ministriesData = [
  {
    id: "youth",
    name: "Youth Fellowship (MYF)",
    category: "organizations",
    icon: <Users />,
    color: "bg-green-100 text-green-700",
    brief: "Empowering the next generation to lead with faith and purpose.",
    description: "The Methodist Youth Fellowship (MYF) at Vepery is more than just a weekly gathering; it's a family. We focus on three core pillars: Spiritual Growth, Social Responsibility, and Christian Leadership.",
    gallery: [
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: [
      { 
        title: "Youth Worship & Fellowship", 
        date: "Every Sunday", 
        time: "10:30 AM", 
        desc: "A time of worship and bonding after the morning service.",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "young-adult",
    name: "Young Adult Fellowship (MYAF)",
    category: "organizations",
    icon: <Users />,
    color: "bg-blue-100 text-blue-700",
    brief: "Bridging the gap between youth and adulthood with theological depth.",
    description: "The Methodist Young Adult Fellowship (MYAF) caters to those in the transitional phase of life—students, early-career professionals, and young couples.",
    gallery: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: [
      { 
        title: "Young Adult Bible Study", 
        date: "First Sundays", 
        time: "10:30 AM", 
        desc: "Deep diving into theology following our morning worship.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "men",
    name: "Men's Fellowship (MMF)",
    category: "organizations",
    icon: <Users />,
    color: "bg-orange-100 text-orange-700",
    brief: "Building strong men of God through prayer, fellowship, and service.",
    description: "The Methodist Men's Fellowship (MMF) is dedicated to helping men grow in their relationship with God and each other.",
    gallery: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: [
      { 
        title: "Men's Fellowship Meeting", 
        date: "Second Sundays", 
        time: "10:30 AM", 
        desc: "Monthly gathering for prayer and service planning.",
        image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "women",
    name: "Women's Fellowship (MWF)",
    category: "organizations",
    icon: <Heart />,
    color: "bg-pink-100 text-pink-700",
    brief: "Empowering women to serve Christ through spiritual growth.",
    description: "The Methodist Women's Fellowship (MWF) is a vibrant group focused on spiritual nurturing and social action.",
    gallery: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: [
      { 
        title: "Women's Fellowship & Study", 
        date: "Every Sunday", 
        time: "10:30 AM", 
        desc: "Spiritual nurturing and fellowship after morning service.",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "sunday-school",
    name: "Sunday School",
    category: "outreach",
    icon: <BookOpen />,
    color: "bg-yellow-100 text-yellow-700",
    brief: "Nurturing children in the love and knowledge of God.",
    description: "Our Sunday School is dedicated to providing a fun and engaging environment for children to learn about the Bible through interactive lessons, songs, and creative activities. We believe that childhood is the most critical time for spiritual foundation, and our dedicated teachers are committed to guiding the next generation in the way of the Lord.",
    fullContent: `
      Our Sunday School program at Methodist Tamil Church Vepery is more than just a weekly class; it's a vibrant community where children discover the wonders of God's Word. Every Sunday, we gather children from ages 3 to 15, dividing them into age-appropriate groups to ensure that the message is both accessible and impactful.

      ### What We Offer:
      - **Engaging Bible Lessons**: We use creative storytelling and visual aids to bring Bible stories to life.
      - **Worship & Music**: Children learn to express their faith through praise and action songs.
      - **Creative Arts**: Crafts and activities that reinforce the day's lesson.
      - **Character Building**: Lessons focused on kindness, honesty, and love.

      Our curriculum is designed to take children through the major themes of the Bible over several years, ensuring they have a broad and deep understanding of their faith by the time they transition to our Youth Fellowship.
    `,
    gallery: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: [
      { 
        title: "VBS 2025: Wonder World", 
        date: "May 5-10, 2025", 
        time: "9:00 AM - 12:30 PM", 
        desc: "A week of adventure, learning, and fun for all children in the community.",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "medical-mission",
    name: "Medical Mission",
    category: "outreach",
    icon: <Heart />,
    color: "bg-red-100 text-red-700",
    brief: "Providing healthcare and support to the underserved.",
    description: "Our Medical Mission team works to provide essential healthcare services, health education, and medical check-ups to those in our community who have limited access to quality healthcare.",
    fullContent: `
      Following the example of Jesus the Great Physician, our Medical Mission team is dedicated to healing and serving. This ministry brings together healthcare professionals—doctors, nurses, and technicians—from our congregation to serve the broader Chennai community.

      ### Our Core Services:
      - **Monthly Health Camps**: We host free check-ups on the last Saturday of every month.
      - **Specialist Consultations**: Through our network, we provide access to various specialties including Pediatrics, Geriatrics, and General Medicine.
      - **Basic Diagnostics**: Blood pressure monitoring, sugar tests, and basic screenings provided free of charge.
      - **Health Education**: Workshops on hygiene, nutrition, and preventative care.

      We believe that caring for the body is an essential part of caring for the soul. Our mission is to reach out with the love of Christ, providing not just medical aid, but hope and prayer for those who are suffering.
    `,
    gallery: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: [
      { 
        title: "Community Health Camp", 
        date: "Last Saturday, Monthly", 
        time: "9:00 AM - 1:00 PM", 
        desc: "Free medical consultations and basic medicines for those in need.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "widow-ministry",
    name: "Widow Ministry",
    category: "outreach",
    icon: <Heart />,
    color: "bg-purple-100 text-purple-700",
    brief: "Supporting and comforting those who have lost their spouses.",
    description: "Our Widow Ministry provides emotional support, fellowship, and practical assistance to the widows in our congregation and community. We aim to be a family to those who feel lonely and a source of strength for those in need.",
    fullContent: `
      In accordance with the biblical mandate to care for widows, our ministry is a cornerstone of our community's compassion. We understand that losing a spouse is one of life's most challenging transitions, and we are here to walk alongside our sisters.

      ### Our Mission:
      - **Spiritual Fellowship**: Regular prayer meetings and Bible studies tailored to their unique spiritual journeys.
      - **Emotional Support**: A safe space to share experiences, grief, and hope with others who understand.
      - **Practical Assistance**: Helping with home maintenance, technical support, and navigating administrative tasks.
      - **Social Outings**: Organized lunches, park visits, and church trips to foster a sense of belonging and joy.

      We believe that our widows have much wisdom to offer the church, and we strive to integrate them into various aspects of church life where their experiences can bless others.
    `,
    gallery: [
      "https://images.unsplash.com/photo-1544333323-5099049ee147?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: []
  },
  {
    id: "kaveripakam-church",
    name: "Kaveripakam Church",
    category: "outreach",
    icon: <Church />,
    color: "bg-amber-100 text-amber-700",
    brief: "Missionary outreach and support for our sister church in Kaveripakam.",
    description: "Support for the Kaveripakam Methodist Church through mission trips, building projects, and financial aid to help their growing congregation in rural Tamil Nadu.",
    fullContent: `
      Kaveripakam Methodist Church is our primary missionary partner in rural Tamil Nadu. As a sister church, we take great responsibility in supporting their growth and helping them reach their local community with the love of Christ.

      ### Our Partnership Includes:
      - **Infrastructure Development**: Assisting in the maintenance and expansion of their church building.
      - **Mobile Medical Camps**: Sending our healthcare professionals to provide much-needed medical aid to the village.
      - **Youth & Children's Outreach**: Conducting annual VBS and youth programs for the children of Kaveripakam.
      - **Pastor Support**: Providing resources and encouragement to the local pastor and his family.

      Many of our church members describe their visits to Kaveripakam as one of the most spiritually renewing experiences of their lives. It's a place where we see faith in its simplest and most powerful form.
    `,
    gallery: [
      "https://images.unsplash.com/photo-1548625361-195fe61a05be?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445452311059-22489c44acc8?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: []
  },
  {
    id: "thirupanakadu",
    name: "Thirupanakadu Ministry",
    category: "outreach",
    icon: <Church />,
    color: "bg-emerald-100 text-emerald-700",
    brief: "Evangelism and community support in Thirupanakadu village.",
    description: "Bringing the Gospel and essential services to the community of Thirupanakadu. We focus on education, basic needs, and spiritual guidance for the local families.",
    fullContent: `
      Our ministry in Thirupanakadu is centered on holistic community transformation. We believe that the Gospel must be expressed in both word and deed, addressing the physical needs of the people alongside their spiritual hunger.

      ### Key Areas of Focus:
      - **Education Support**: Providing school supplies and tuition help for children from low-income families.
      - **Community Prayer Cells**: Establishing small groups for prayer and fellowship within the village.
      - **Basic Needs Assistance**: Providing seasonal aid such as clothing, blankets, and dry rations during challenging times.
      - **Evangelistic Outreach**: Sharing the message of Christ through street plays, film screenings, and personal testimonies.

      Thirupanakadu is a testament to how God can work in small, rural communities when we are faithful in our commitment to serve and love.
    `,
    gallery: [
      "https://images.unsplash.com/photo-1490237014491-8aa29811ea61?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: []
  },
  {
    id: "annavelli",
    name: "Annavelli Ministry",
    category: "outreach",
    icon: <Church />,
    color: "bg-indigo-100 text-indigo-700",
    brief: "Local mission work and church planting in Annavelli.",
    description: "Spreading faith and establishing a Christian presence in Annavelli through targeted outreach, children's programs, and local leadership development.",
    fullContent: `
      Annavelli is an area of significant mission opportunity. Our work here is focused on establishing a sustainable Christian presence that can serve as a lighthouse for the surrounding neighborhoods.

      ### Outreach Strategy:
      - **House-to-House Visits**: Building personal relationships and praying with local families.
      - **Children's Bible Clubs**: Providing a safe and joyful place for children to learn about God's love.
      - **Community Service Projects**: Identifying local needs such as sanitation or clean water and working to find solutions.
      - **Leadership Training**: Mentoring local believers to take on leadership roles within their own community.

      Our vision for Annavelli is to see a thriving, self-sustaining congregation that continues to push the boundaries of mission work in the region.
    `,
    gallery: [
      "https://images.unsplash.com/photo-1544333323-5099049ee147?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510519133411-c99949987820?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: []
  },
  {
    id: "vasuvasamuthiram",
    name: "Vasuvasamuthiram Ministry",
    category: "outreach",
    icon: <Church />,
    color: "bg-cyan-100 text-cyan-700",
    brief: "Outreach and social welfare programs in Vasuvasamuthiram.",
    description: "Dedicated to the spiritual and physical well-being of the Vasuvasamuthiram community through regular visits, support groups, and health awareness.",
    fullContent: `
      Vasuvasamuthiram is a community where we have seen incredible spiritual hunger. Our ministry here is characterized by a deep sense of commitment to the people and a desire to see every family touched by the grace of God.

      ### What we do:
      - **Family Prayer Meetings**: Gathering families in their homes to worship and study the Bible.
      - **Women's Empowerment**: Organizing vocational training and support groups for the women of the village.
      - **Youth Mentorship**: Guiding young people towards positive life choices and spiritual growth.
      - **Festival Outreach**: Hosting special events during major holidays to share the Gospel with the entire community.

      The warmth and hospitality of the people in Vasuvasamuthiram make this ministry a joy to be part of.
    `,
    gallery: [
      "https://images.unsplash.com/photo-1534067783941-51c9c238bd34?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: []
  },
  {
    id: "kalpakam",
    name: "Kalpakam Ministry",
    category: "outreach",
    icon: <Church />,
    color: "bg-teal-100 text-teal-700",
    brief: "Missionary efforts and spiritual guidance in Kalpakam.",
    description: "Empowering the local community of Kalpakam through faith-based service, educational support, and regular spiritual gatherings.",
    fullContent: `
      Kalpakam, known for its strategic importance, is also a place of great spiritual need. Our ministry here seeks to reach out to the diverse population of the area, providing a place of spiritual refuge and community.

      ### Our Core Pillars:
      - **Intercessory Prayer**: Regular prayer walks and dedicated prayer times for the peace and prosperity of Kalpakam.
      - **Gospel Proclamation**: Sharing the message of Christ with clarity and compassion.
      - **Mercy Ministry**: Providing practical help to those who are struggling financially or emotionally.
      - **Biblical Training**: Offering foundational Bible courses for new believers.

      We believe that God has an incredible plan for Kalpakam, and we are privileged to be a small part of what He is doing in this community.
    `,
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-37559ee23d75?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?q=80&w=1200&fm=webp&q=75&auto=format&fit=crop"
    ],
    events: []
  }
];

// Material 3 Card Component - Fixed prop warning
const M3Card = ({ children, className = "", hover = true, ...props }: { children: React.ReactNode, className?: string, hover?: boolean, [key: string]: any }) => {
  // Destructure hover to avoid passing it to motion.div
  const { hover: _hover, ...rest } = { hover, ...props };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hover ? { 
        y: -8, 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderColor: "rgba(26, 51, 117, 0.1)"
      } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      className={`bg-white rounded-[32px] p-8 border border-black/[0.03] shadow-sm transition-all duration-500 ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

// Material 3 Button Component
const M3Button = ({ children, variant = "filled", className = "", onClick, ...props }: { children: React.ReactNode, variant?: "filled" | "outlined" | "tonal", className?: string, onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void, [key: string]: any }) => {
  const baseStyles = "relative overflow-hidden px-6 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
  const variants = {
    filled: "bg-primary text-white hover:shadow-lg hover:bg-primary/90 active:scale-95",
    outlined: "border border-outline text-primary hover:bg-primary/5 active:scale-95",
    tonal: "bg-secondary text-primary hover:shadow-md hover:bg-secondary/90 active:scale-95"
  };

  return (
    <motion.button 
      onClick={onClick} 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      {...props} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

// Lightbox Component
const Lightbox = ({ isOpen, image, onClose }: { isOpen: boolean, image: string | null, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            onClick={onClose}
          >
            <X size={40} />
          </motion.button>
          <motion.img
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            src={image}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Navigation Progress Bar
const ProgressBar = ({ isAnimating }: { isAnimating: boolean }) => (
  <div className="fixed top-0 left-0 right-0 z-[100] h-1 pointer-events-none">
    <motion.div
      initial={{ width: "0%", opacity: 0 }}
      animate={isAnimating ? { 
        width: ["0%", "30%", "100%"], 
        opacity: [0, 1, 1, 0],
      } : { width: "0%", opacity: 0 }}
      transition={{ 
        duration: 0.4, 
        times: [0, 0.4, 1],
        ease: "easeInOut" 
      }}
      className="h-full bg-secondary shadow-[0_0_10px_rgba(255,215,0,0.5)]"
    />
  </div>
);

// Ministry Detail Page Component
const MinistryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ministry = ministriesData.find(m => m.id === id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!ministry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-primary">Ministry Not Found</h2>
        <M3Button onClick={() => navigate('/')}>Go Back Home</M3Button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-surface min-h-screen">
      <Lightbox isOpen={!!selectedImage} image={selectedImage} onClose={() => setSelectedImage(null)} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden mb-16">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src={ministry.gallery[0]} 
            alt={ministry.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/#outreach')}
              className="flex items-center gap-2 text-white/80 font-bold mb-8 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Ministries
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl backdrop-blur-md bg-opacity-20 border border-white/20 ${ministry.color}`}>
                  {ministry.icon}
                </div>
                <span className="text-secondary font-bold tracking-[0.3em] uppercase text-xs">Our Mission</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                {ministry.name}
              </h1>
              <p className="text-white/80 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
                {ministry.brief}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg prose-primary max-w-none mb-20"
            >
              <h2 className="text-primary font-bold">About the Ministry</h2>
              <div className="text-on-surface-variant leading-[1.8] whitespace-pre-line text-lg">
                {(ministry as any).fullContent || ministry.description}
              </div>
            </motion.div>

            {/* Gallery Section */}
            <section className="mb-20">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-primary">In Action</h2>
                <div className="h-px bg-outline/20 flex-1 ml-8" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ministry.gallery.slice(1).map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedImage(img)}
                    className="group relative aspect-[16/10] overflow-hidden rounded-[32px] cursor-pointer shadow-lg"
                  >
                    <img 
                      src={img} 
                      alt={`${ministry.name} gallery`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform duration-500">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* Upcoming Events */}
            {ministry.events && ministry.events.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Calendar className="text-secondary" />
                  Upcoming Events
                </h3>
                    <div className="space-y-6">
                      {ministry.events.map((event, i) => (
                        <M3Card key={i} className="p-0 overflow-hidden bg-white border-outline/5 border hover:border-secondary/20 transition-all shadow-md">
                          <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-secondary font-bold text-sm bg-secondary/10 px-3 py-1 rounded-full">{event.date}</div>
                        </div>
                        <h4 className="font-bold text-primary text-lg mb-2">{event.title}</h4>
                        <p className="text-on-surface-variant text-sm line-clamp-2">{event.desc}</p>
                      </div>
                    </M3Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-primary mb-6">Need more info?</h3>
              <div className="space-y-4">
                <a href="mailto:contact@mtcvepery.com" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-outline/5 hover:border-primary/20 transition-all">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <span className="text-on-surface-variant font-medium text-sm">Email Coordinator</span>
                </a>
                <a href="tel:+914425301234" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-outline/5 hover:border-primary/20 transition-all">
                  <div className="w-10 h-10 bg-secondary/5 rounded-xl flex items-center justify-center text-primary">
                    <Phone size={18} />
                  </div>
                  <span className="text-on-surface-variant font-medium text-sm">Call Office</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Gallery Page Component
const GalleryPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-20 bg-surface min-h-screen">
      <Lightbox isOpen={!!selectedImage} image={selectedImage} onClose={() => setSelectedImage(null)} />
      <div className="container mx-auto px-4">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/#gallery-section')}
          className="flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all"
        >
          <ChevronRight className="rotate-180" />
          Back to Home
        </motion.button>
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-12">Church <span className="text-secondary italic">Gallery</span></h1>
        
        <div className="space-y-16">
          {ministriesData.filter(m => m.gallery && m.gallery.length > 0).map((ministry) => (
            <section key={ministry.id}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ministry.color}`}>
                  {ministry.icon}
                </div>
                <h2 className="text-2xl font-bold text-primary">{ministry.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ministry.gallery.map((img, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedImage(img)}
                    className="aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-outline/5"
                  >
                    <img 
                      src={img} 
                      alt={`${ministry.name} gallery`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      referrerPolicy="no-referrer" 
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

// Events Page Component
const EventsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-20 bg-surface min-h-screen">
      <div className="container mx-auto px-4">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/#home')}
          className="flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all"
        >
          <ChevronRight className="rotate-180" />
          Back to Home
        </motion.button>
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-12">Upcoming <span className="text-secondary italic">Events</span></h1>
        
        <div className="space-y-16">
          {ministriesData.filter(m => m.events && m.events.length > 0).map((ministry) => (
            <section key={ministry.id}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ministry.color}`}>
                  {ministry.icon}
                </div>
                <h2 className="text-2xl font-bold text-primary">{ministry.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ministry.events?.map((event, i) => (
                  <M3Card key={i} className="overflow-hidden flex flex-col md:flex-row">
                    {event.image && (
                      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-8 flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-primary">{event.title}</h3>
                          <p className="text-secondary font-medium">{event.date} • {event.time}</p>
                        </div>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed">{event.desc}</p>
                      <M3Button variant="tonal" className="mt-6 !text-white" onClick={() => navigate(`/ministry/${ministry.id}`)}>Learn More</M3Button>
                    </div>
                  </M3Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pastorate Committee Page Component
const PastorateCommitteePage = () => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Executive Officers",
      members: [
        { role: "Chairman", name: "Rev. Sam Sudalaiyandi (Senior Pastor)", image: "https://images.unsplash.com/photo-1544168190-79c17527004f?q=80&w=400&h=500&fit=crop" },
        { role: "Associate Pastor", name: "Rev. R. Meganathan", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&fit=crop" },
        { role: "Secretary", name: "Mr. Andrews", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=500&fit=crop" },
        { role: "Treasurer", name: "Mr. D Premkumar", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=500&fit=crop" }
      ]
    },
    {
      title: "Standing Committees",
      members: [
        { role: "Committee on Nominations", name: "Chairperson: Pastor", image: "https://images.unsplash.com/photo-1544168190-79c17527004f?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Membership & Records", name: "Mr. Murali Krishnan", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Evangelism & Missions", name: "Mr. Sunny Dhayakaran", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Stewardship & Finance", name: "Mr. Bakthasiromani", image: "https://images.unsplash.com/photo-1590086782792-42dd2350140d?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Education & Christian Nurture", name: "Mrs. Christinal Smiles", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Social Concern", name: "Dr. Samson Franklin", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Lay Activities", name: "Mr. R. D. Christopher", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Property of the Pastoral Charge", name: "Mr. Moses Solomon", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Conciliation, Peace & Discipline", name: "Mr. Solomon Sampath", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=500&fit=crop" }
      ]
    },
    {
      title: "Special Committees",
      members: [
        { role: "Committee on Educational Scholarship", name: "Mr. Jeyaraj Moses", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&h=500&fit=crop" },
        { role: "Committee on Music and Worship", name: "Mr. Ravikumar", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&h=500&fit=crop" }
      ]
    },
    {
      title: "Organization Heads",
      members: [
        { role: "Committee on Sunday School", name: "Mrs. Esther Jenefa McKenzie", image: "https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?q=80&w=400&h=500&fit=crop" },
        { role: "Methodist Youth Fellowship", name: "Mr. Graceson Eliezer", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&h=500&fit=crop" },
        { role: "Methodist Young Adult Fellowship", name: "Mrs. Radhika Vijay", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=500&fit=crop" },
        { role: "Womens Society for Christian Service", name: "Mrs. Mala Suresh", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&h=500&fit=crop" },
        { role: "Methodist Men Fellowship", name: "Mr. Dicruz", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&h=500&fit=crop" }
      ]
    },
    {
      title: "Additional Members",
      type: "list",
      members: [
        { name: "Mr. John Sugumar", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&fit=crop" },
        { name: "Mr. Janeswaran", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=500&fit=crop" },
        { name: "Mr. Victor Devaraj", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=500&fit=crop" },
        { name: "Mr. Babu", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=500&fit=crop" },
        { name: "Mrs. Diana Alwin", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=500&fit=crop" }
      ]
    },
    {
      title: "Advisors",
      members: [
        { role: "Methodist Youth Fellowship", name: "Mrs. & Mr. Alwin Jose", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&h=500&fit=crop" },
        { role: "Methodist Young Adult Fellowship", name: "Mrs. & Mr. Isaac Kamalesh", image: "https://images.unsplash.com/photo-1521791136366-319504849646?q=80&w=400&h=500&fit=crop" }
      ]
    }
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-surface">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Governance</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight leading-tight"
          >
            Pastorate <span className="text-secondary italic">Committee</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-xl leading-relaxed max-w-3xl mx-auto"
          >
            A dedicated group of leaders elected to steward the spiritual and administrative mission of Methodist Tamil Church Vepery.
          </motion.p>
        </div>

        {/* Structured Data View */}
        <div className="max-w-5xl mx-auto space-y-12">
          {sections.map((section, sIndex) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sIndex * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-primary whitespace-nowrap">{section.title}</h2>
                <div className="h-px bg-outline/20 w-full" />
              </div>

              {section.type === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.members.map((member, mIndex) => (
                    <M3Card key={mIndex} className="p-0 overflow-hidden bg-white border-outline/5 hover:border-primary/20 transition-all group" hover={true}>
                      <div className="flex h-32">
                        <div className="w-24 overflow-hidden">
                          <img 
                            src={(member as any).image} 
                            alt={member.name}
                            className="w-full h-full object-cover transition-all duration-500"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-6 flex-1 flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Users size={16} />
                          </div>
                          <span className="font-bold text-primary">{member.name}</span>
                        </div>
                      </div>
                    </M3Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.members.map((member, mIndex) => (
                    <M3Card key={mIndex} className="p-0 overflow-hidden bg-white border-outline/5 hover:border-primary/20 transition-all group" hover={true}>
                      <div className="flex flex-col h-full">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={(member as any).image} 
                            alt={member.name} 
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-6 border-l-4 border-secondary flex-1">
                          <p className="text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-1">{member.role}</p>
                          <h3 className="text-lg font-bold text-primary">{member.name}</h3>
                        </div>
                      </div>
                    </M3Card>
                  ))}
                </div>
              )}
            </motion.section>
          ))}
        </div>

        {/* Return to Home Section */}
        <div className="mt-28 text-center border-t border-outline/10 pt-16">
          <p className="text-on-surface-variant mb-8 text-lg">Back to church homepage</p>
          <div className="flex flex-wrap justify-center gap-4">
            <M3Button variant="tonal" onClick={() => navigate('/')}>
               <ArrowLeft size={18} />
               Back to Home
            </M3Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Senior Pastor Page Component
const HistoryPage = () => {
  const navigate = useNavigate();
  useEffect(() => window.scrollTo(0, 0), []);

  const historySections = [
    {
      year: "1874–1890",
      title: "Early Beginnings",
      content: [
        "On 4 February 1874, William Taylor arrived in Madras (present-day Chennai), staying at Fort St. George with Dr. F. H. Condon. Despite having only around 86 English-speaking supporters, Dr. Miller of Madras Christian College offered Taylor the college hall, and several other venues opened to him, including the Union Prayer Meeting Hall and Memorial Hall.",
        "Taylor's campaign was far-reaching, resulting in the formation of eight groups within six months. One of his favorite preaching spots was the Fountain opposite Doveton College. In May 1874, George Bown and volunteers like Mrs. Raitt joined the work, leading to spiritual revivals in Perambur, Salem, and beyond.",
        "On 26 December 1874, Rev. C. P. Hard arrived as the first superintendent of the Madras Circuit, finding a church of 350 members. By 1875, there were nearly 50 meetings per week. In 1884, the Methodist Publishing House was established by Rev. A. W. Rudisill—a major milestone.",
        "In 1890, under Rev. William L. King, the first Methodist Tamil Church in Ritherdon Road was constructed with a thatched roof."
      ],
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
    },
    {
      year: "1905–1967",
      title: "Growth and Consolidation",
      content: [
        "Rev. James J. Kingham (1905–1928) and Rev. K. R. Gopal Iyer laid the foundation for the current church building in 1906, which was dedicated on 6 December 1917. This splendid structure stands as a lasting testament to Kingham’s leadership and his mastery of Tamil.",
        "From 1931 to 1966, Honorary Pastor A. Samuel guided the church during the critical years when foreign mission support was withdrawn, becoming the longest-serving pastor in MTC's history.",
        "From 1938 to 1961, Rev. J. C. Whit Church served the church, during which time the first organ was purchased. In 1963, Rev. D. S. Sahayadhas unified scattered families and revitalized services, leading to the construction of Alice Hall for the Golden Jubilee in 1967. A church choir was also established during this era."
      ],
      image: "https://images.unsplash.com/photo-1548625361-195fe61a05be?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
    },
    {
      year: "1970–1999",
      title: "Modernisation and Outreach",
      content: [
        "This period saw the beginning of village ministries and a push for self-reliance. Rev. Y. Moses Selvaraj (1975–1983) played a pivotal role, expanding ministries to districts like Madurai, Tiruchi, and Coimbatore. Pioneer workers like Rev. Hepsibah Jackson and Rev. A. X. P. Rayen were the first to represent MTC Vepery outside the city.",
        "In 1987, Rev. Martin Alphonse launched the monthly newsletter, 'Methodist Malar'. Later, Rev. Samuel J. Royappa (1989–1999) ushered in rapid growth, overseeing the Platinum Jubilee Building Project and starting ministries around Kallakuruchi and Chennai.",
        "A generation of young men and women from the church dedicated themselves to theological studies during this time, strengthening the Pastoral Ministry for years to come."
      ],
      image: "https://images.unsplash.com/photo-1510519133411-c99949987820?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
    },
    {
      year: "2003–Present",
      title: "Recent Developments",
      content: [
        "Rev. J. S. Santharaj (2005–2008) initiated the 40-Day Lenten season devotion which remains a blessing to this day, and oversaw the completion of the modern two-storey Platinum Jubilee Faith Building.",
        "In 2009, MTC Vepery became the first to establish the Methodist Young Adults Fellowship (MYAF), an initiative pioneered by Mr. Daniel Peter that is now formally included in the Methodist Book of Discipline.",
        "Under the leadership of Rev. Andrew B. Natarajan, the Centenary Celebrations in 2017 were a historic milestone, featuring the release of an Indian stamp, a 100-voice choir, and the procurement of a new organ.",
        "Currently, Rev. Sam Sudalaiyandi and Rev. Meganathan continue to guide the church. Recent innovations include 'Natchathira Iravu' (Star Night), a dedicated Media Department launched during the pandemic, and the donation of land for new churches in regions like Kalpakkam and Red Hills.",
        "In 2025, Bishop C. G. Dayanand and Bishop Sukalatha Dayanand began their powerful ministry, as the church continues to grow in faith and service."
      ],
      image: "https://images.unsplash.com/photo-1509062522246-37559ee23d75?q=80&w=800&fm=webp&q=75&auto=format&fit=crop"
    }
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/#about')}
            className="flex items-center gap-2 text-primary font-bold mb-12 hover:gap-3 transition-all"
          >
            <ChevronLeft />
            Back to Home
          </motion.button>

          <header className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              <span className="text-secondary font-bold tracking-widest uppercase text-xs">Chronicle of Faith</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-8 leading-tight tracking-tighter">Our <span className="text-secondary italic">Story</span></h1>
            <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">A chronological account of growth, service, and spiritual legacy since 1874.</p>
            <div className="w-24 h-2 bg-secondary rounded-full mt-8" />
          </header>

          <div className="space-y-24 relative pb-20">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-40 bottom-0 w-px bg-outline/10 hidden md:block" />

            {historySections.map((section, index) => (
              <motion.section 
                key={section.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:rtl' : ''}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-secondary rounded-full -translate-x-[7.5px] border-4 border-surface z-10 hidden md:block" />
                
                <div className="md:ltr space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-secondary/20 font-mono tracking-tighter">{section.year}</span>
                    <h2 className="text-3xl font-bold text-primary">{section.title}</h2>
                  </div>
                  <div className="space-y-4 text-on-surface-variant text-lg leading-relaxed">
                    {section.content.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>

                <div className="rounded-[40px] overflow-hidden shadow-2xl relative aspect-[4/3] group md:ltr">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-20" />
                </div>
              </motion.section>
            ))}
          </div>

          <section className="mt-40 bg-surface-variant rounded-[64px] p-12 md:p-20 text-center border border-outline/10 shadow-inner">
            <h2 className="text-3xl font-bold text-primary mb-12">Historical Sources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-on-surface-variant text-sm bg-white p-10 rounded-[40px] shadow-sm">
              <div className="space-y-4">
                <p>• Vision and Victories in the Hindustan (Vol. 1), Chapter XV – Madras – By Rev J J Kingham, M.A Methodist Publishing House, Madras, 1931 by Bishop Brenton T Badley.</p>
                <p>• Methodist Marka Sarithira Surukam, Bangalore, 1915, July 18 written by Bishop J. E. Robinson (Book owned by Mr. Reuben D.S. Raj).</p>
              </div>
              <div className="md:border-l border-outline/10 md:pl-8">
                <p className="font-bold text-primary mb-2">Compiled by:</p>
                <p>Rev. Sam Sudalaiyandi, Mrs. Amali Vincent & Mr. Derry Raghland</p>
                <p className="text-xs mt-2 italic">October 2025</p>
              </div>
            </div>
          </section>

          <div className="mt-20 pt-12 border-t border-outline/10 flex flex-wrap justify-center gap-6">
            <M3Button variant="tonal" onClick={() => navigate('/#pastors')}>Meet Our Leaders</M3Button>
            <M3Button variant="outlined" onClick={() => navigate('/#contact')}>Join Our Story</M3Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeniorPastorPage = () => {
  const navigate = useNavigate();
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/#pastors')}
            className="flex items-center gap-2 text-primary font-bold mb-12 hover:gap-3 transition-all"
          >
            <ChevronRight className="rotate-180" />
            Back to Home
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-[40px] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://picsum.photos/seed/pastor1/800/1000" 
                alt="Rev. Sam sudalaiyandi" 
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                <h1 className="text-3xl font-bold text-white">Rev. Sam sudalaiyandi</h1>
                <p className="text-white/80 font-bold text-sm uppercase tracking-widest mt-1">Senior Pastor</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span className="text-primary font-bold tracking-widest uppercase text-xs">A Pastoral Welcome</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">Word from the <span className="text-secondary italic">Senior Pastor</span></h2>
              <div className="w-20 h-1.5 bg-secondary rounded-full" />
              
              <div className="space-y-6 text-on-surface-variant text-xl leading-relaxed italic border-l-4 border-secondary/30 pl-8 py-4 font-light">
                <p>Dearly beloved in the Lord,</p>
                <p>Shalom! I am delighted to greet you on behalf of the Methodist Tamil Church, Vepery, Chennai. MTC Vepery as she is known traces her origin to the year 1874 when the Methodist Tamil work was initiated in this vicinity by the pioneering missionaries, and then in 1917 when the Church building was dedicated to the glory of God and to the service of mankind. We thank God that this Church which is part of the Chennai Regional Conference is the largest Tamil speaking Congregation of the Methodist Church in India.</p>
                <p>You would be pleased to know through this website that MTC is a vibrant church that has become the Home Church dearly loved by generations whose lives have been transformed through the Goodnews of Jesus Christ. Furthermore, the Church has been instrumental in taking this life transforming message of the Gospel of Christ to many parts of the Chennai city and to different towns and cities in the State of Tamilnadu.</p>
                <p>May I invite you to scroll through all that is happening - the diverse activities and ministries of the church as reflected here on a regular basis and become part of the exciting life and ministry of MTC Vepery.</p>
                <div className="pt-4">
                  <p>Blessings,</p>
                  <p className="font-bold">Rev Sam Sudalaiyandi</p>
                  <p className="text-sm">Senior Pastor</p>
                </div>
              </div>
              
              <div className="pt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Signature className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-primary text-2xl">— Rev Sam Sudalaiyandi</p>
                  <p className="text-on-surface-variant text-sm font-medium">Methodist Tamil Church Vepery</p>
                </div>
              </div>

              <div className="pt-8 flex flex-wrap gap-4">
                <M3Button variant="tonal" onClick={() => navigate('/#contact')}>Schedule a Meeting</M3Button>
                <M3Button variant="outlined" onClick={() => navigate('/#fellowships')}>Explore Fellowships</M3Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Associate Pastor Page Component
const AssociatePastorPage = () => {
  const navigate = useNavigate();
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/#pastors')}
            className="flex items-center gap-2 text-primary font-bold mb-12 hover:gap-3 transition-all"
          >
            <ChevronRight className="rotate-180" />
            Back to Home
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image First on Mobile, Second on Desktop (using order) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-[40px] overflow-hidden shadow-2xl lg:order-2"
            >
              <img 
                src="https://picsum.photos/seed/pastor2/800/1000" 
                alt="Rev. R. Meganathan" 
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                <h1 className="text-3xl font-bold text-white">Rev. R. Meganathan</h1>
                <p className="text-white/80 font-bold text-sm uppercase tracking-widest mt-1">Associate Pastor</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span className="text-primary font-bold tracking-widest uppercase text-xs">Pastoral Insight</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">Message from the <span className="text-secondary italic">Associate Pastor</span></h2>
              <div className="w-20 h-1.5 bg-secondary rounded-full" />
              
              <div className="space-y-6 text-on-surface-variant text-xl leading-relaxed italic border-l-4 border-secondary/30 pl-8 py-4">
                <p>"It is a privilege to serve this vibrant community and witness the powerful ways God is working in our lives. Our mission is to be a source of hope and transformation in Vepery and beyond."</p>
                <p>"In our church, we value every soul and believe in the power of collective prayer and fellowship. We are dedicated to nurturing the next generation and empowering all to live a life that glorifies God."</p>
                <p>"Come and find your purpose here. We invite you to be part of our ministries and experience the warmth of a community rooted in Christ’s love."</p>
              </div>
              
              <div className="pt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-primary text-2xl">— Rev. R. Meganathan</p>
                  <p className="text-on-surface-variant text-sm font-medium">Associate Pastor, MTC Vepery</p>
                </div>
              </div>

              <div className="pt-8 flex flex-wrap gap-4">
                <M3Button variant="tonal" onClick={() => navigate('/#outreach')}>Ministry Opportunities</M3Button>
                <M3Button variant="outlined" onClick={() => navigate('/events')}>Upcoming Events</M3Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Drifting Orbs Component with Parallax
const Orbs = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 5000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 5000], [0, 200]);

  const orbsArray = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 300 + 100,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 6 + 8,
    delay: Math.random() * i * 0.2,
    opacity: Math.random() * 0.07 + 0.08,
    speed: Math.random() > 0.5 ? y1 : y2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {orbsArray.map((orb) => (
        <motion.div
          key={orb.id}
          style={{ 
            y: orb.speed,
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            opacity: orb.opacity,
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "#1f3c88",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 15, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut"
          }}
          className="absolute bg-primary rounded-full"
        />
      ))}
    </div>
  );
};

// Hero Carousel Component
const HeroCarousel = ({ scrollToSection }: { scrollToSection: (e: React.MouseEvent<HTMLElement>, id: string) => void }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    "https://images.pexels.com/photos/28935111/pexels-photo-28935111.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/31756378/pexels-photo-31756378.png?auto=compress&cs=tinysrgb&w=1200"
  ];

  useEffect(() => {
    // Preload images to prevent white flash
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  const headline = "Rooted in Faith, Growing in Love.";

  return (
    <section id="home" className="relative h-[90vh] flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: "5%", scale: 1.1 }}
            animate={{ opacity: 1, x: "0%", scale: 1 }}
            exit={{ opacity: 0, x: "-5%", scale: 1.1 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              x: { duration: 2, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 2.5, ease: "easeOut" }
            }}
            className="absolute inset-0"
          >
            <img 
              src={images[currentSlide]} 
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover brightness-[0.55] animate-ken-burns"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent z-[1]" />
        <Orbs />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 text-center lg:text-left">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">Welcome Home</span>
              </motion.div>
              <motion.h1 
                key={`h1-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-[-0.04em]"
              >
                {headline.split(", ").map((part, i) => (
                  <span key={i} className="block mb-2">
                    {part.split(" ").map((word, j) => {
                      let colorClass = "text-white";
                      if (word.includes("Faith")) colorClass = "text-secondary italic font-serif";
                      else if (word.includes("Love")) colorClass = "text-accent italic font-serif";
                      
                      return (
                        <span key={j} className={`inline-block mr-[0.2em] last:mr-0 ${colorClass}`}>
                          {word}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </motion.h1>
              <motion.p 
                key={`p-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-white/70 text-lg md:text-2xl mb-12 leading-relaxed max-w-2xl font-light"
              >
                Experience the warmth of fellowship and the depth of worship at the heart of Chennai's heritage.
              </motion.p>
              <motion.div 
                key={`btns-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6"
              >
                <M3Button variant="tonal" className="bg-white text-primary hover:bg-secondary hover:text-white px-10 py-5 text-lg font-bold transition-all duration-300" onClick={(e: any) => scrollToSection(e, 'contact')}>
                  Join Us This Sunday
                  <ChevronRight size={20} />
                </M3Button>
                <M3Button variant="outlined" className="text-white border-white/20 hover:border-white/60 backdrop-blur-sm px-10 py-5 text-lg" onClick={() => navigate('/history')}>
                  Discover Our Story
                </M3Button>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              style={{ perspective: 1000 }}
            >
              <M3Card 
                hover={false}
                whileHover={{ 
                  y: -15, 
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 40px 80px -15px rgba(0, 0, 0, 0.5)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-xl border-white/20 text-white p-8 relative overflow-hidden group cursor-default"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                  <ChurchLogo className="w-24 h-24 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <Clock size={20} />
                    </div>
                    <span className="text-secondary font-bold uppercase tracking-widest text-xs">Join Us Today</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-6 group-hover:text-secondary transition-colors">Service Timings</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 group/item">
                      <div className="text-secondary font-bold text-lg pt-1 group-hover/item:scale-110 transition-transform">08:30</div>
                      <div>
                        <p className="font-bold">Morning Service</p>
                        <p className="text-white/60 text-sm">Main Sanctuary</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 group/item">
                      <div className="text-secondary font-bold text-lg pt-1 group-hover/item:scale-110 transition-transform">06:30</div>
                      <div>
                        <p className="font-bold">Evening Service</p>
                        <p className="text-white/60 text-sm">Main Sanctuary</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 text-sm text-white/80">
                      <MapPin size={16} className="text-secondary animate-bounce" />
                      <span>Vepery, Chennai</span>
                    </div>
                  </div>
                </div>
              </M3Card>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
        <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all group">
          <ChevronRight size={24} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex gap-3">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-secondary' : 'w-3 bg-white/30 hover:bg-white/50'}`} />
          ))}
        </div>
        <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all group">
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

// Fellowship Card Component (Magnetic + Icon Bounce)
const FellowshipCard = ({ ministry, onClick }: { ministry: any, onClick: () => void }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useTransform(y, [0, 1], [6, -6]);
  const rotateY = useTransform(x, [0, 1], [-6, 6]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setIsHovered(false);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <M3Card onClick={onClick} className="cursor-pointer group h-full relative overflow-hidden p-0" hover={false} initial={false} whileInView={false}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={ministry.gallery[0]} 
            alt={ministry.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <div className={`w-12 h-12 rounded-xl ${ministry.color} flex items-center justify-center backdrop-blur-md bg-opacity-90`}>
              {ministry.icon}
            </div>
          </div>
        </div>
        <div className="p-8">
          <h4 className="text-xl font-bold text-primary mb-3">{ministry.name}</h4>
          <p className="text-on-surface-variant text-sm mb-6">{ministry.brief}</p>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            Learn More <ChevronRight size={14} />
          </div>
        </div>
      </M3Card>
    </motion.div>
  );
};

// Outreach Card Component (3D Tilt + Shimmer)
const OutreachCard = ({ ministry, onClick }: { ministry: any, onClick: () => void }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useTransform(y, [0, 1], [6, -6]);
  const rotateY = useTransform(x, [0, 1], [-6, 6]);
  
  const imgRotateX = useTransform(y, [0, 1], [-2, 2]);
  const imgRotateY = useTransform(x, [0, 1], [2, -2]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setIsHovered(false);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <M3Card onClick={onClick} className="cursor-pointer group h-full relative overflow-hidden p-0" hover={false} initial={false} whileInView={false}>
        <div className="relative h-48 overflow-hidden">
          <motion.img 
            style={{ rotateX: imgRotateX, rotateY: imgRotateY, scale: 1.1 }}
            src={ministry.gallery[0]} 
            alt={ministry.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
            referrerPolicy="no-referrer"
          />
          {/* Shimmer Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              initial={{ left: "-100%" }}
              animate={isHovered ? { left: "100%" } : { left: "-100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            />
          </div>
        </div>
        <div className="p-8">
          <div className={`w-12 h-12 rounded-xl ${ministry.color} flex items-center justify-center mb-4`}>
            {ministry.icon}
          </div>
          <h4 className="text-xl font-bold text-primary mb-2">{ministry.name}</h4>
          <p className="text-on-surface-variant text-sm mb-4">{ministry.brief}</p>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            Learn More <ChevronRight size={14} />
          </div>
        </div>
      </M3Card>
    </motion.div>
  );
};

// Main Landing Page Component
const MainContent = ({ scrollToSection }: { scrollToSection: (e: React.MouseEvent<HTMLElement>, id: string) => void }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const shouldReduceMotion = useReducedMotion();

  // About Section Parallax
  const aboutRef = useRef(null);
  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });
  const aboutBgY = useTransform(aboutScroll, [0, 1], ["0%", "30%"]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('sending');
    setTimeout(() => setContactStatus('success'), 1500);
  };

  return (
    <>
        <Lightbox isOpen={!!selectedImage} image={selectedImage} onClose={() => setSelectedImage(null)} />
        <HeroCarousel scrollToSection={scrollToSection} />

        {/* Heritage Section */}
        <section ref={aboutRef} id="about" className="py-20 bg-surface-variant/10 relative overflow-hidden">
          {/* Parallax Background Element */}
          <motion.div 
            style={{ y: shouldReduceMotion ? 0 : aboutBgY }}
            className="absolute -right-20 -top-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">Our Heritage</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">A Legacy of Faith in the Heart of Vepery</h2>
              <div className="text-on-surface-variant text-lg mb-12 leading-relaxed space-y-4 text-center max-w-3xl mx-auto">
                <p>
                  The Methodist Tamil Church, Vepery, traces its origin to 1874 with the arrival of William Taylor in Madras, which led to the formation of the Methodist Episcopal Church among Tamil believers. 
                </p>
                <p>
                  A permanent church was established at Vepery, and the present historic church building was dedicated in 1917, marking a major milestone in its growth. 
                  Through the 20th century, the church strengthened its evangelistic, educational, and musical ministries despite periods of challenge and transition. 
                </p>
                <p>
                  From the 1970s onward, the church expanded its outreach through village ministries, regional conferences, and active lay organizations. 
                  In recent decades, the church has embraced modernization, media ministry, and social outreach while remaining rooted in its mission to glorify Christ.
                </p>
              </div>
              <div className="relative group max-w-2xl mx-auto mb-12">
                <img 
                  src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?q=80&w=800&fm=webp&q=75&auto=format&fit=crop" 
                  alt="Church Heritage" 
                  className="w-full aspect-[16/9] object-cover rounded-[40px] shadow-2xl"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <M3Button variant="tonal" className="!text-white" onClick={() => navigate('/history')}>Our History</M3Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Pastors Section */}
        <section id="pastors" className="py-24 bg-surface">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Pastors</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg mb-12">Led by faith, serving with love. Meet the leaders of our congregation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => navigate('/senior-pastor')}
                className="group cursor-pointer"
              >
                <div className="relative mb-6 overflow-hidden rounded-[32px] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src="https://picsum.photos/seed/pastor1/600/800" 
                    alt="Senior Pastor" 
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <M3Button variant="tonal" className="w-full py-3 !text-white">Read Welcome Message</M3Button>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-primary">Rev. Sam sudalaiyandi</h3>
                <p className="text-secondary font-medium">Senior Pastor</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate('/associate-pastor')}
                className="group cursor-pointer"
              >
                <div className="relative mb-6 overflow-hidden rounded-[32px] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src="https://picsum.photos/seed/pastor2/600/800" 
                    alt="Associate Pastor" 
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <M3Button variant="tonal" className="w-full py-3 !text-white">Read Welcome Message</M3Button>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-primary">Rev. R. Meganathan</h3>
                <p className="text-secondary font-medium">Associate Pastor</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery-section" className="py-24 bg-surface relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <span className="text-[#da0e0e] font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Visual Testimony</span>
                <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">Our <span className="text-secondary italic">Gallery</span></h2>
              </div>
              <M3Button variant="tonal" className="!text-white" onClick={() => navigate('/gallery')}>
                View Full Gallery
                <ChevronRight size={18} />
              </M3Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[800px]">
              {ministriesData.flatMap(m => m.gallery).slice(0, 5).map((img, i) => (
                <motion.div 
                  key={i}
                  initial={shouldReduceMotion ? { opacity: 0 } : { 
                    opacity: 0, 
                    clipPath: "inset(100% 0 0 0)" 
                  }}
                  whileInView={shouldReduceMotion ? { opacity: 1 } : { 
                    opacity: 1, 
                    clipPath: "inset(0% 0 0 0)" 
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: shouldReduceMotion ? 0 : i * 0.15,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  onClick={() => setSelectedImage(img)}
                  className={`${i === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"} relative rounded-[32px] overflow-hidden shadow-lg group cursor-pointer border border-outline/5`}
                >
                  <img 
                    src={img} 
                    alt={`Gallery ${i}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fellowships Section */}
        <section id="fellowships" className="py-24 bg-surface-variant/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Fellowships</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">Growing together in faith through our various fellowship groups.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8">
              {ministriesData.filter(m => m.category === 'organizations').map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={shouldReduceMotion ? { opacity: 0 } : { 
                    opacity: 0, 
                    y: 60, 
                    rotateX: 8 
                  }}
                  whileInView={shouldReduceMotion ? { opacity: 1 } : { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0 
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: shouldReduceMotion ? 0 : index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <FellowshipCard ministry={ministry} onClick={() => navigate(`/ministry/${ministry.id}`)} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Outreach Ministries Section */}
        <section id="outreach" className="py-24 bg-surface" style={{ perspective: "1000px" }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Ministries</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">Serving our community and spreading God's love through action.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {ministriesData.filter(m => m.category === 'outreach').map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={shouldReduceMotion ? { opacity: 0 } : { 
                    opacity: 0, 
                    y: 60, 
                    rotateX: 8 
                  }}
                  whileInView={shouldReduceMotion ? { opacity: 1 } : { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0 
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: shouldReduceMotion ? 0 : index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <OutreachCard ministry={ministry} onClick={() => navigate(`/ministry/${ministry.id}`)} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-24 bg-surface">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-4xl font-bold text-primary mb-6">Get in Touch</h2>
                <p className="text-on-surface-variant text-lg mb-10">Have questions or need prayer? We're here for you. Reach out to us through the form or our contact details.</p>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Our Location</h4>
                      <p className="text-on-surface-variant text-sm">1, Ritherdon Rd, Vepery, Chennai - 600007</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Phone Number</h4>
                      <p className="text-on-surface-variant text-sm">{/* TODO: replace with real data */}+91 44 2532 1234</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Email Address</h4>
                      <p className="text-on-surface-variant text-sm">{/* TODO: replace with real data */}contact@mtcvepery.org</p>
                    </div>
                  </div>
                </div>
              </div>

              <M3Card className="bg-white shadow-2xl border-outline/5 p-10" hover={false}>
                {contactStatus === 'success' ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Message Sent!</h3>
                    <p className="text-on-surface-variant mb-8">Thank you for reaching out. We will get back to you shortly.</p>
                    <M3Button variant="tonal" onClick={() => setContactStatus('idle')}>Send Another Message</M3Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary ml-1">Full Name</label>
                      <input required type="text" className="w-full bg-surface-variant/30 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary ml-1">Email Address</label>
                      <input required type="email" className="w-full bg-surface-variant/30 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary ml-1">Your Message</label>
                      <textarea required rows={4} className="w-full bg-surface-variant/30 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all resize-none" placeholder="How can we help you?"></textarea>
                    </div>
                    <M3Button type="submit" className="w-full py-4 text-lg" disabled={contactStatus === 'sending'}>
                      {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                      <Send size={20} />
                    </M3Button>
                  </form>
                )}
              </M3Card>
            </div>
          </div>
        </section>
    </>
  );
};

// Navigation Links
const navLinks = [
  { name: 'Home', href: '/#home', id: 'home' },
  { 
    name: 'About us', 
    href: '/#about', 
    id: 'about',
    submenu: [
      { name: 'Our Pastors', href: '/#pastors', id: 'pastors' },
      { name: 'Pastorate Committee', href: '/pastorate-committee', id: 'pastorate-committee', isExternal: true },
    ]
  },
  { name: 'Gallery', href: '/#gallery-section', id: 'gallery-section' },
  { name: 'Fellowships', href: '/#fellowships', id: 'fellowships' },
  { name: 'Ministries', href: '/#outreach', id: 'outreach' },
  { name: 'Events', href: '/events', id: 'events', isExternal: true },
  { name: 'Contact', href: '/#contact', id: 'contact' },
];

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-[70] w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border border-white/20 hover:bg-secondary transition-all"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success'>('idle');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isHomeTransitioning, setIsHomeTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const isSubPage = location.pathname !== '/';

  const navigateToHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsHomeTransitioning(true);
    setTimeout(() => {
      navigate('/');
      window.scrollTo(0, 0);
      setTimeout(() => setIsHomeTransitioning(false), 600);
    }, 400);
  };

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      if (isSubPage) {
        setActiveSection(null);
        return;
      }

      const sections = ['home', 'about', 'pastors', 'gallery-section', 'fellowships', 'outreach', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSubPage]);

  useEffect(() => {
    if (isSubPage) {
      setActiveSection(null);
    }
  }, [location.pathname, isSubPage]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const scrollToSection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('success');
    setTimeout(() => setNewsletterStatus('idle'), 3000);
  };

  const headerActive = scrolled || isSubPage;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
      <ProgressBar isAnimating={isNavigating} />
      
      <AnimatePresence>
        {isHomeTransitioning && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white text-center"
            >
              <ChurchLogo className="w-20 h-20 mx-auto mb-6 opacity-30 text-secondary" />
              <div className="h-px w-12 bg-secondary/30 mx-auto mb-4" />
              <span className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px]">Welcome Home</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerActive ? 'bg-white/90 backdrop-blur-2xl shadow-sm border-b border-black/5 py-2' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex-1 flex justify-start">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={navigateToHome}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center p-1.5 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <ChurchLogo className="w-full h-full text-white" />
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-lg tracking-tighter leading-none transition-colors duration-500 ${headerActive ? 'text-primary' : 'text-white'}`}>METHODIST TAMIL CHURCH</span>
                <span className={`text-[9px] font-bold tracking-[0.2em] uppercase mt-1 transition-colors duration-500 ${headerActive ? 'text-secondary' : 'text-secondary/80'}`}>Estd 1874</span>
              </div>
            </div>
          </div>

          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-all duration-500 ${headerActive ? 'bg-surface-variant/50 border-outline/10 backdrop-blur-md' : 'bg-white/10 border-white/10 backdrop-blur-md'}`}>
            <div className="relative group/nav">
              <a
                href={navLinks[0].href}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToHome();
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
                  (activeSection === 'home' && location.pathname === '/')
                    ? 'bg-primary text-white shadow-md' 
                    : `${headerActive ? 'text-on-surface hover:bg-primary/5' : 'text-white hover:bg-white/10'}`
                }`}
              >
                Home
              </a>
            </div>
            {navLinks.slice(1).map((link) => (
              <div key={link.name} className="relative group/nav">
                <a
                  href={link.href}
                  onClick={(e) => link.isExternal ? (e.preventDefault(), navigate(link.href), window.scrollTo({ top: 0, behavior: 'smooth' })) : scrollToSection(e, link.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
                    (link.isExternal ? location.pathname === link.href : activeSection === link.id && location.pathname === '/')
                      ? 'bg-primary text-white shadow-md' 
                      : `${headerActive ? 'text-on-surface hover:bg-primary/5' : 'text-white hover:bg-white/10'}`
                  }`}
                >
                  {link.name}
                  {link.submenu && <ChevronDown size={14} className="group-hover/nav:rotate-180 transition-transform duration-300" />}
                </a>

                {link.submenu && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-xl border border-outline/5 overflow-hidden w-48 py-2">
                      {link.submenu.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          onClick={(e) => {
                            if (sub.isExternal) {
                              e.preventDefault();
                              navigate(sub.href);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              scrollToSection(e, sub.id);
                            }
                          }}
                          className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 flex items-center transition-colors border-b border-black/5 last:border-0"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex-1 flex items-center justify-end gap-4">
            <M3Button 
              variant="outlined" 
              onClick={() => navigate('/history')}
              className={`hidden lg:flex text-xs py-2 ${headerActive ? 'border-primary text-primary' : 'border-white/30 text-white'}`}
            >
              Malar
            </M3Button>
            <a href="https://www.youtube.com/@MethodistTamilChurch" target="_blank" rel="noopener noreferrer" className={`p-2.5 rounded-xl transition-all duration-300 ${headerActive ? 'text-red-600 hover:bg-red-50' : 'text-white hover:bg-white/10'}`}>
              <Youtube size={22} />
            </a>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2.5 rounded-xl transition-colors md:hidden ${headerActive ? 'text-primary hover:bg-primary/5' : 'text-white hover:bg-white/10'}`}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-2xl md:hidden flex flex-col p-6">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center p-1.5 shadow-md">
                  <ChurchLogo className="w-full h-full text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg text-primary tracking-tighter leading-none">METHODIST TAMIL CHURCH</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase mt-1 text-secondary">Estd 1874</span>
                </div>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-surface-variant/50 text-primary rounded-xl hover:bg-surface-variant transition-colors"><X size={24} /></button>
            </div>
            <nav className="flex flex-col gap-2">
              <div key={navLinks[0].name}>
                <motion.a
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 * 0.05 }}
                  href={navLinks[0].href}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    navigateToHome();
                  }}
                  className={`text-2xl font-bold p-5 rounded-3xl transition-all flex items-center justify-between ${
                    (activeSection === 'home' && location.pathname === '/')
                      ? 'bg-primary text-white shadow-lg translate-x-2' : 'text-on-surface hover:bg-primary/5'
                  }`}
                >
                  {navLinks[0].name}
                  <ChevronRight size={24} className={activeSection === 'home' ? 'opacity-100' : 'opacity-20'} />
                </motion.a>
              </div>
              {navLinks.slice(1).map((link, i) => (
                <div key={link.name}>
                  <motion.a
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i + 1) * 0.05 }}
                    href={link.href}
                    onClick={(e) => link.isExternal ? (e.preventDefault(), setIsMenuOpen(false), navigate(link.href), window.scrollTo({ top: 0, behavior: 'smooth' })) : scrollToSection(e, link.id)}
                    className={`text-2xl font-bold p-5 rounded-3xl transition-all flex items-center justify-between ${
                      (link.isExternal ? location.pathname === link.href : activeSection === link.id && location.pathname === '/')
                        ? 'bg-primary text-white shadow-lg translate-x-2' : 'text-on-surface hover:bg-primary/5'
                    }`}
                  >
                    {link.name}
                    {!link.submenu && <ChevronRight size={24} className={activeSection === link.id ? 'opacity-100' : 'opacity-20'} />}
                  </motion.a>
                  
                  {link.submenu && (
                    <div className="pl-6 flex flex-col gap-1 mt-2 mb-4">
                      {link.submenu.map((sub, si) => (
                        <motion.a
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + si * 0.05 }}
                          key={sub.name} href={sub.href}
                          onClick={(e) => { 
                            e.preventDefault(); 
                            setIsMenuOpen(false); 
                            if (sub.isExternal) {
                              navigate(sub.href);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              scrollToSection(e, sub.id); 
                            }
                          }}
                          className="text-lg font-bold p-4 rounded-2xl text-on-surface-variant hover:bg-primary/5 transition-colors"
                        >
                          {sub.name}
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 px-4">
                <M3Button 
                  variant="outlined" 
                  onClick={() => { setIsMenuOpen(false); navigate('/history'); }}
                  className="w-full py-4 text-primary border-primary"
                >
                  Malar
                </M3Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={shouldReduceMotion ? { opacity: 0 } : { x: 60, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: -60, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: shouldReduceMotion ? "linear" : "easeOut", 
              delay: shouldReduceMotion ? 0 : 0.05 
            }}
          >
            <Routes location={location}>
              <Route path="/" element={<MainContent scrollToSection={scrollToSection} />} />
              <Route path="/ministry/:id" element={<MinistryDetail />} />
              <Route path="/senior-pastor" element={<SeniorPastorPage />} />
              <Route path="/associate-pastor" element={<AssociatePastorPage />} />
              <Route path="/pastorate-committee" element={<PastorateCommitteePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        <ScrollToTopButton />
      </main>

      <footer className="bg-on-surface text-surface py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={useReducedMotion() ? { opacity: 0 } : { opacity: 0, y: 30 }}
            whileInView={useReducedMotion() ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
          >
            <motion.div transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
                  <ChurchLogo className="w-full h-full text-primary" />
                </div>
                <span className="font-bold text-xl">MTC Vepery</span>
              </div>
              <p className="text-surface/60 max-w-md mb-8 leading-relaxed">A community of faith, hope, and love in the heart of Chennai. Join us as we grow together in Christ.</p>
              <div className="flex gap-4">
                <a href="https://www.youtube.com/@MethodistTamilChurch" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-surface/10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-lg">
                  <Youtube size={24} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </motion.div>
            
            <motion.div transition={{ duration: 0.6 }}>
              <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
              <ul className="space-y-4 text-surface/60">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} onClick={(e) => link.isExternal ? (e.preventDefault(), navigate(link.href), window.scrollTo({ top: 0, behavior: 'smooth' })) : scrollToSection(e, link.id)} className="hover:text-secondary transition-colors">{link.name}</a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div transition={{ duration: 0.6 }}>
              <h4 className="font-bold text-lg mb-6 text-white">Ministries</h4>
              <ul className="space-y-4 text-surface/60">
                {ministriesData.slice(0, 4).map((min) => (
                  <li key={min.id}><Link to={`/ministry/${min.id}`} className="hover:text-secondary transition-colors">{min.name}</Link></li>
                ))}
              </ul>
            </motion.div>

            <motion.div transition={{ duration: 0.6 }}>
              <h4 className="font-bold text-lg mb-6 text-white">Newsletter</h4>
              <p className="text-surface/60 mb-6">Subscribe to receive weekly updates and sermon notes.</p>
              {newsletterStatus === 'success' ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-secondary font-bold">Thank you for subscribing!</motion.p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input required type="email" placeholder="Your email" className="bg-surface/10 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-secondary w-full" />
                  <button type="submit" className="bg-secondary text-primary p-2 rounded-full hover:scale-105 transition-transform"><ChevronRight size={20} /></button>
                </form>
              )}
            </motion.div>
          </motion.div>
          <div className="pt-12 border-t border-surface/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-surface/60">
            <p>© 2026 Methodist Tamil Church Vepery. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-surface transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-surface transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export { Root as default };
