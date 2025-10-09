import { connectToDatabase } from "@/lib/mongodb";
import UniversalModuleModel from "@/models/UniversalModule";
import ModuleCategoryModel from "@/models/ModuleCategory";
import type { ModuleType } from "@/types/universal-module";

const sampleData = {
  "study-india": {
    categories: ["Engineering", "Medical", "Management", "Arts"],
    modules: [
      {
        title: "IIT Delhi - B.Tech Computer Science",
        shortDescription: "Premier engineering program at IIT Delhi",
        detailedDescription:
          "IIT Delhi's Computer Science program is one of India's most prestigious engineering courses. Students receive rigorous training in algorithms, data structures, and system design. The program includes industry internships and research opportunities.",
        category: "Engineering",
        customFields: [
          { key: "State", value: "Delhi" },
          { key: "University", value: "IIT Delhi" },
          { key: "Course Duration", value: "4 years" },
          { key: "Fees", value: "₹2.5 Lakhs/year" },
        ],
        highlights: [
          "Top IIT in India",
          "Excellent placement record",
          "Research opportunities",
          "Industry collaborations",
        ],
        coverImage: "sample/iit-delhi-cover",
        galleryImages: [],
        published: true,
      },
      {
        title: "IIM Ahmedabad - MBA",
        shortDescription: "Top management program in India",
        detailedDescription:
          "IIM Ahmedabad's MBA program is India's premier management education. The curriculum focuses on leadership, strategy, and innovation. Students benefit from case-based learning and industry interactions.",
        category: "Management",
        customFields: [
          { key: "State", value: "Gujarat" },
          { key: "University", value: "IIM Ahmedabad" },
          { key: "Course Duration", value: "2 years" },
          { key: "Fees", value: "₹25 Lakhs total" },
        ],
        highlights: [
          "Top B-School in India",
          "Average package ₹30 LPA",
          "Global exchange programs",
          "Strong alumni network",
        ],
        coverImage: "sample/iim-ahmedabad-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "placement-india": {
    categories: ["IT", "Finance", "Consulting", "Manufacturing"],
    modules: [
      {
        title: "Software Engineer - TCS",
        shortDescription: "Software development role at TCS",
        detailedDescription:
          "Join TCS as a Software Engineer and work on cutting-edge projects for global clients. You'll be part of a dynamic team developing enterprise solutions using latest technologies. Excellent growth opportunities and comprehensive training provided.",
        category: "IT",
        customFields: [
          { key: "Company", value: "Tata Consultancy Services" },
          { key: "Location", value: "Bangalore, Mumbai, Pune" },
          { key: "Package", value: "₹6-8 LPA" },
          { key: "Job Role", value: "Software Engineer" },
        ],
        highlights: [
          "Fortune 500 company",
          "Global exposure",
          "Comprehensive training",
          "Career growth opportunities",
        ],
        coverImage: "sample/tcs-cover",
        galleryImages: [],
        published: true,
      },
      {
        title: "Management Trainee - Infosys",
        shortDescription: "Leadership program at Infosys",
        detailedDescription:
          "Infosys Management Trainee program offers fast-track career growth. You'll rotate through different departments, work on strategic projects, and receive mentorship from senior leaders. The program prepares you for leadership roles.",
        category: "IT",
        customFields: [
          { key: "Company", value: "Infosys" },
          { key: "Location", value: "Bangalore, Hyderabad" },
          { key: "Package", value: "₹8-10 LPA" },
          { key: "Job Role", value: "Management Trainee" },
        ],
        highlights: [
          "Leadership development",
          "Cross-functional exposure",
          "International opportunities",
          "Fast-track growth",
        ],
        coverImage: "sample/infosys-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "placement-abroad": {
    categories: ["Technology", "Finance", "Healthcare", "Engineering"],
    modules: [
      {
        title: "Software Engineer - Google",
        shortDescription: "Join Google's engineering team",
        detailedDescription:
          "Work on products used by billions of users worldwide. Google offers challenging projects, collaborative environment, and industry-leading compensation. You'll work with cutting-edge technologies and brilliant engineers.",
        category: "Technology",
        customFields: [
          { key: "Country", value: "United States" },
          { key: "Company", value: "Google" },
          { key: "Package", value: "$120,000-150,000" },
          { key: "Job Role", value: "Software Engineer" },
        ],
        highlights: [
          "Work on global products",
          "Competitive compensation",
          "Learning opportunities",
          "Great work culture",
        ],
        coverImage: "sample/google-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "internship-india": {
    categories: ["Technology", "Marketing", "Finance", "Design"],
    modules: [
      {
        title: "Summer Internship - Flipkart",
        shortDescription: "3-month tech internship at Flipkart",
        detailedDescription:
          "Work on real projects at India's leading e-commerce company. You'll collaborate with experienced engineers, learn industry best practices, and contribute to products used by millions. Potential for pre-placement offer.",
        category: "Technology",
        customFields: [
          { key: "Company", value: "Flipkart" },
          { key: "Location", value: "Bangalore" },
          { key: "Stipend", value: "₹50,000/month" },
          { key: "Duration", value: "3 months" },
        ],
        highlights: [
          "Hands-on experience",
          "Mentorship program",
          "PPO opportunity",
          "Certificate provided",
        ],
        coverImage: "sample/flipkart-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "internship-abroad": {
    categories: ["Technology", "Research", "Business", "Design"],
    modules: [
      {
        title: "Software Engineering Intern - Microsoft",
        shortDescription: "Summer internship at Microsoft",
        detailedDescription:
          "Join Microsoft's internship program and work on innovative projects. You'll receive mentorship from senior engineers, attend tech talks, and network with professionals. Competitive compensation and potential for full-time offer.",
        category: "Technology",
        customFields: [
          { key: "Country", value: "United States" },
          { key: "Company", value: "Microsoft" },
          { key: "Stipend", value: "$7,000/month" },
          { key: "Duration", value: "12 weeks" },
        ],
        highlights: [
          "Work on Azure, Office 365",
          "Housing assistance",
          "Networking events",
          "Return offer potential",
        ],
        coverImage: "sample/microsoft-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "mbbs-india": {
    categories: ["Government", "Private", "Deemed"],
    modules: [
      {
        title: "AIIMS Delhi - MBBS",
        shortDescription: "Premier medical education at AIIMS",
        detailedDescription:
          "AIIMS Delhi offers world-class medical education with state-of-the-art facilities. Students receive comprehensive clinical training and research opportunities. The program includes rotations in various specialties and exposure to diverse cases.",
        category: "Government",
        customFields: [
          { key: "College", value: "AIIMS Delhi" },
          { key: "State", value: "Delhi" },
          { key: "Fees", value: "₹5,000/year" },
          { key: "Seats Available", value: "100" },
        ],
        highlights: [
          "Top medical college in India",
          "Minimal fees",
          "Excellent faculty",
          "Research opportunities",
        ],
        coverImage: "sample/aiims-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "mbbs-abroad": {
    categories: ["USA", "UK", "Russia", "Philippines"],
    modules: [
      {
        title: "Johns Hopkins University - MD Program",
        shortDescription: "World-renowned medical program",
        detailedDescription:
          "Johns Hopkins offers one of the world's best medical programs. Students benefit from cutting-edge research, renowned faculty, and clinical training at top hospitals. The program emphasizes both clinical skills and research.",
        category: "USA",
        customFields: [
          { key: "Country", value: "United States" },
          { key: "University", value: "Johns Hopkins" },
          { key: "Fees", value: "$60,000/year" },
          { key: "Duration", value: "4 years" },
        ],
        highlights: [
          "Top 3 medical school globally",
          "Research opportunities",
          "Clinical excellence",
          "Global recognition",
        ],
        coverImage: "sample/johns-hopkins-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  lms: {
    categories: ["Corporate Law", "International Law", "IP Law", "Tax Law"],
    modules: [
      {
        title: "Harvard Law School - LMS",
        shortDescription: "Elite LMS program at Harvard",
        detailedDescription:
          "Harvard Law School's LMS program offers specialized legal education for international lawyers. Students can customize their curriculum, participate in clinics, and benefit from Harvard's extensive resources and network.",
        category: "International Law",
        customFields: [
          { key: "University", value: "Harvard Law School" },
          { key: "Specialization", value: "International Law" },
          { key: "Duration", value: "1 year" },
          { key: "Fees", value: "$70,000" },
        ],
        highlights: [
          "Top law school globally",
          "Flexible curriculum",
          "Global alumni network",
          "Career services",
        ],
        coverImage: "sample/harvard-law-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "uni-project": {
    categories: ["Research", "Innovation", "Collaboration", "Startup"],
    modules: [
      {
        title: "AI Research Project - MIT",
        shortDescription: "Cutting-edge AI research at MIT",
        detailedDescription:
          "Join MIT's AI research project focusing on machine learning and neural networks. Work with leading researchers, access advanced computing resources, and contribute to groundbreaking research. Potential for publication and conference presentations.",
        category: "Research",
        customFields: [
          { key: "University", value: "MIT" },
          { key: "Department", value: "Computer Science" },
          { key: "Duration", value: "6 months" },
          { key: "Funding", value: "$5,000 stipend" },
        ],
        highlights: [
          "Work with top researchers",
          "Publication opportunities",
          "Advanced resources",
          "Conference presentations",
        ],
        coverImage: "sample/mit-research-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "school-project": {
    categories: ["Science", "Math", "Arts", "Technology"],
    modules: [
      {
        title: "Robotics Workshop for High School",
        shortDescription: "Hands-on robotics learning program",
        detailedDescription:
          "Interactive robotics workshop for high school students. Learn programming, electronics, and mechanical design while building real robots. Includes competitions and project presentations.",
        category: "Technology",
        customFields: [
          { key: "School", value: "Open to all schools" },
          { key: "Grade Level", value: "9-12" },
          { key: "Subject", value: "Robotics" },
          { key: "Duration", value: "8 weeks" },
        ],
        highlights: [
          "Hands-on learning",
          "Build real robots",
          "Competition participation",
          "Certificate provided",
        ],
        coverImage: "sample/robotics-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  "mou-project": {
    categories: ["Academic", "Industry", "Research", "International"],
    modules: [
      {
        title: "IIT-Stanford Collaboration",
        shortDescription: "Research partnership between IIT and Stanford",
        detailedDescription:
          "Strategic partnership enabling joint research, student exchange, and collaborative projects. Faculty and students from both institutions work together on cutting-edge research in AI, sustainability, and healthcare.",
        category: "International",
        customFields: [
          { key: "Partner Organization", value: "Stanford University" },
          { key: "Duration", value: "5 years" },
          { key: "Scope", value: "Research & Student Exchange" },
          { key: "Benefits", value: "Joint publications, funding" },
        ],
        highlights: [
          "Joint research projects",
          "Student exchange program",
          "Shared resources",
          "International collaboration",
        ],
        coverImage: "sample/iit-stanford-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
  loans: {
    categories: ["Education Loan", "Study Abroad Loan", "Skill Development"],
    modules: [
      {
        title: "SBI Education Loan",
        shortDescription: "Comprehensive education loan from SBI",
        detailedDescription:
          "State Bank of India offers education loans up to ₹1.5 crore for studies in India and abroad. Competitive interest rates, flexible repayment options, and quick processing. No collateral required for loans up to ₹7.5 lakhs.",
        category: "Education Loan",
        customFields: [
          { key: "Interest Rate", value: "8.5% p.a." },
          { key: "Max Amount", value: "₹1.5 Crore" },
          { key: "Tenure", value: "Up to 15 years" },
          { key: "Provider", value: "State Bank of India" },
        ],
        highlights: [
          "Low interest rates",
          "No collateral up to ₹7.5L",
          "Tax benefits available",
          "Quick processing",
        ],
        coverImage: "sample/sbi-loan-cover",
        galleryImages: [],
        published: true,
      },
      {
        title: "HDFC Credila Education Loan",
        shortDescription: "Study abroad loan specialist",
        detailedDescription:
          "HDFC Credila specializes in education loans for international studies. Covers tuition, living expenses, and travel. Flexible repayment starting after course completion. Expert guidance throughout the process.",
        category: "Study Abroad Loan",
        customFields: [
          { key: "Interest Rate", value: "9.5% p.a." },
          { key: "Max Amount", value: "₹2 Crore" },
          { key: "Tenure", value: "Up to 15 years" },
          { key: "Provider", value: "HDFC Credila" },
        ],
        highlights: [
          "Covers 100% expenses",
          "Moratorium period available",
          "Expert counseling",
          "Fast approval",
        ],
        coverImage: "sample/hdfc-loan-cover",
        galleryImages: [],
        published: true,
      },
    ],
  },
};

async function seedModules() {
  try {
    console.log("🌱 Starting to seed modules...");

    await connectToDatabase();
    console.log("✅ Connected to database");

    // Clear existing data
    await UniversalModuleModel.deleteMany({});
    await ModuleCategoryModel.deleteMany({});
    console.log("🗑️  Cleared existing data");

    let totalModules = 0;
    let totalCategories = 0;

    // Seed each module type
    for (const [moduleType, data] of Object.entries(sampleData)) {
      console.log(`\n📦 Seeding ${moduleType}...`);

      // Create categories
      for (const categoryName of data.categories) {
        await ModuleCategoryModel.create({
          name: categoryName,
          moduleType: moduleType as ModuleType,
        });
        totalCategories++;
      }
      console.log(`  ✅ Created ${data.categories.length} categories`);

      // Create modules
      for (const moduleData of data.modules) {
        await UniversalModuleModel.create({
          ...moduleData,
          moduleType: moduleType as ModuleType,
        });
        totalModules++;
      }
      console.log(`  ✅ Created ${data.modules.length} modules`);
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log(`📊 Total categories created: ${totalCategories}`);
    console.log(`📊 Total modules created: ${totalModules}`);
    console.log("\n✨ Sample data is ready to use!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Run the seed function
seedModules()
  .then(() => {
    console.log("\n✅ Done! You can now view the data in your app.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });
