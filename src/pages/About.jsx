import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  UserGroupIcon,
  TrophyIcon,
  LightBulbIcon,
  SwatchIcon,
  CpuChipIcon,
  ArrowUpTrayIcon,
  QueueListIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  SparklesIcon,
  ScissorsIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import Shailesh from "../assets/images/Shailesh.png";
import Sheela from "../assets/images/Sheela.png";
import Shubham from "../assets/images/Shubham.png";
import Sunil from "../assets/images/Sunil.png";
import Kavita from "../assets/images/Kavita.png";
import Abouthero from "../assets/images/abouthero.jpg";

const About = () => {
  const primary = "#FF4500";
  const secondary = "#FF6B35";

  const stats = [
    { label: "Happy Clients", value: "500+" },
    { label: "Projects Completed", value: "1000+" },
    { label: "Years Experience", value: "10+" },
    { label: "Team Members", value: "15+" },
  ];

  const values = [
    {
      icon: CheckCircleIcon,
      title: "Quality First",
      description:
        "We never compromise on quality and ensure every design meets the highest standards.",
    },
    {
      icon: UserGroupIcon,
      title: "Customer Focused",
      description:
        "Our clients are at the heart of everything we do. We listen, understand, and deliver.",
    },
    {
      icon: TrophyIcon,
      title: "Creative Excellence",
      description:
        "We push creative boundaries to deliver unique and memorable design solutions.",
    },
  ];

  const maharashtraTeam = [
    {
      name: "Sunil Gopale",
      role: "CEO - Marketing (India Region)",
      image: Sunil,
      description: "Oversees marketing strategies and operations in India.",
    },
    {
      name: "Kavita Gopale",
      role: "Delivery Head (India)",
      image: Kavita,
      description: "Responsible for timely delivery and project execution in India.",
    },
    {
      name: "Shailesh L",
      role: "CEO & Founder",
      image: Shailesh,
      description: "Founder of the company, driving vision and growth.",
    },
    {
      name: "Sheela Lanke",
      role: "Operation Head (India)",
      image: Sheela,
      description: "Oversees daily operations and team management in India.",
    },
    {
      name: "Shubham Mane",
      role: "Co-Founder & MD",
      image: Shubham,
      description: "Manages overall operations and strategic decisions.",
    },
  ];

  const gujaratTeam = [
    {
      name: "Amit Patel",
      role: "Regional Business Head",
      image: "https://randomuser.me/api/portraits/men/81.jpg",
      description: "Leads business development and regional growth in Gujarat.",
    },
    {
      name: "Neha Shah",
      role: "Operations Manager",
      image: "https://randomuser.me/api/portraits/women/72.jpg",
      description: "Manages operations and client coordination across Gujarat.",
    },
    {
      name: "Raj Mehta",
      role: "Technology Lead",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      description: "Oversees technology strategy and execution in the region.",
    },
  ];


  const processSteps = [
    {
      num: "01",
      title: "Idea & Concept",
      desc: "The process begins with a design idea—sketch, logo, artwork, customer requirement, or inspiration image.",
      icon: LightBulbIcon,
    },
    {
      num: "02",
      title: "Choosing Fabric & Material",
      desc: "Select fabric type, thread type, needle size, and stabilizer. Each fabric needs suitable materials.",
      icon: SwatchIcon,
    },
    {
      num: "03",
      title: "Digitizing the Design",
      desc: "Digitizing converts the design into stitch format (DST/PES/JEF) using software like Wilcom, Hatch, or Tajima DG/ML.",
      icon: CpuChipIcon,
    },
    {
      num: "04",
      title: "Transferring the File to Machine",
      desc: "The digitized file is transferred to the embroidery machine via USB, WiFi, or memory card.",
      icon: ArrowUpTrayIcon,
    },
    {
      num: "05",
      title: "Hooping the Fabric",
      desc: "Fabric is hooped tightly with stabilizer to avoid wrinkles and ensure accurate stitching.",
      icon: QueueListIcon,
    },
    {
      num: "06",
      title: "Thread & Machine Setup",
      desc: "Machine setup includes threading needles, selecting colors, adjusting tension, and placing bobbin correctly.",
      icon: WrenchScrewdriverIcon,
    },
    {
      num: "07",
      title: "Test Stitching",
      desc: "A test stitch is performed to check stitch quality, density, registration, and thread tension.",
      icon: BeakerIcon,
    },
    {
      num: "08",
      title: "Final Embroidery",
      desc: "After approval, the final embroidery is stitched while monitoring thread breaks and machine movement.",
      icon: SparklesIcon,
    },
    {
      num: "09",
      title: "Finishing & Cleaning",
      desc: "Extra threads are trimmed, stabilizer is removed, and steam pressing is done for a clean finish.",
      icon: ScissorsIcon,
    },
    {
      num: "10",
      title: "Quality Check",
      desc: "Final checks ensure alignment, color accuracy, consistency, and wrinkle-free finishing.",
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F] overflow-x-hidden">
      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[90vh] flex items-center justify-center text-center"
      >
        <img
          src={Abouthero}
          alt="About Shree Graphics Design"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-6"
          >
            About{" "}
            <span className="font-extrabold" style={{ color: primary }}>
              Shree Graphics Design
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg text-gray-700 max-w-2xl mx-auto mb-10"
          >
            We are a team of creative designers and embroidery experts committed
            to crafting unique and impactful brand identities.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              style={{ backgroundColor: primary }}
              className="text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition transform hover:scale-105"
            >
              Get In Touch
            </Link>

            <Link
              to="/products"
              className="border-2 border-[#FF4500] px-8 py-3 rounded-lg font-semibold 
             text-[#FF4500] hover:bg-[#FF4500] hover:text-white 
             transition-all duration-300 transform hover:scale-105"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* STATS */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="w-full px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-transparent hover:border-[#FF4500] transition transform hover:-translate-y-2"
            >
              <div className="text-4xl font-extrabold mb-2" style={{ color: primary }}>
                {stat.value}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 bg-white">
        <div className="w-full px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: primary }}>
              Our Story
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Founded in 2014,{" "}
              <span className="font-semibold">Shree Graphics Design</span> began
              with a passion for embroidery and brand storytelling. What started
              as a small creative workshop has evolved into a nationwide design hub.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe every brand deserves to be remembered — our mission is
              to turn ideas into art stitched with excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-first lg:order-last"
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c"
              alt="Our Studio"
              className="rounded-2xl shadow-xl hover:scale-105 transition duration-500"
            />
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION — PROCESS OF EMBROIDERY DESIGN (ANIMATED + INDUSTRIAL) */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="w-full px-6 max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-6"
            style={{ color: primary }}
          >
            Process of Embroidery Design
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center text-gray-600 max-w-2xl mx-auto mb-10"
          >
            A professional, step-by-step industrial workflow that ensures every
            embroidery design is precise, durable, and production-ready.
          </motion.p>

          {/* MOBILE SWIPE LAYOUT */}
          <div className="md:hidden flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="min-w-[80%] snap-center p-6 bg-white rounded-2xl shadow-lg border border-transparent hover:border-[#FF4500] hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#FFF4F0" }}
                    >
                      <Icon className="w-7 h-7" style={{ color: primary }} />
                    </div>
                    <span
                      className="text-xl font-extrabold tracking-widest"
                      style={{ color: primary }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* DESKTOP GRID / INDUSTRIAL CARDS */}
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-10 mt-4">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="p-8 bg-white rounded-2xl shadow-lg border border-transparent hover:border-[#FF4500] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute -right-6 -top-4 text-6xl font-extrabold opacity-10 group-hover:opacity-20 transition duration-300">
                    {step.num}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: "#FFF4F0" }}
                    >
                      <Icon className="w-8 h-8" style={{ color: primary }} />
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* SHORT VERSION SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 p-8 bg-white rounded-2xl shadow-xl border-l-8"
            style={{ borderColor: primary }}
          >
            <h3 className="text-2xl font-bold mb-3" style={{ color: primary }}>
              Short Version
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              Concept → Fabric Selection → Digitizing → Machine Setup → Hooping →
              Test Stitch → Final Stitch → Finishing → Quality Check.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="w-full px-4 text-center">
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
            style={{ color: primary }}
          >
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-2xl shadow border border-transparent hover:border-[#FF4500] hover:shadow-lg transition transform hover:-translate-y-3"
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FFF4F0" }}
                >
                  <value.icon className="h-8 w-8" style={{ color: primary }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 bg-white">
        <div className="w-full px-4 text-center">

          {/* MAIN HEADING */}
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
            style={{ color: primary }}
          >
            Meet Our Leadership Team
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-gray-600 mb-16 max-w-2xl mx-auto"
          >
            A talented group of creative minds leading our design excellence.
          </motion.p>

          {/* ===== MAHARASHTRA REGION ===== */}
          <div className="mb-20">

            <h3 className="text-3xl font-bold text-gray-800">
              Maharashtra Region
            </h3>
            <div className="w-24 h-1 bg-[#FF4500] mx-auto my-3 rounded-full" />
            <p className="text-gray-500 max-w-xl mx-auto mb-10">
              Leadership driving innovation and strategic growth across Maharashtra.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
              {maharashtraTeam.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow border border-transparent hover:border-[#FF4500] hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-t-2xl"
                  />
                  <div className="p-5 text-left">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="font-medium text-[#FF4500]">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* ===== GUJARAT REGION ===== */}
          <div>

            <h3 className="text-3xl font-bold text-gray-800">
              Gujarat Region
            </h3>
            <div className="w-24 h-1 bg-[#FF4500] mx-auto my-3 rounded-full" />
            <p className="text-gray-500 max-w-xl mx-auto mb-10">
              Strengthening regional partnerships and operational excellence in Gujarat.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
              {gujaratTeam.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow border border-transparent hover:border-[#FF4500] hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-t-2xl"
                    loading="lazy"
                  />
                  <div className="p-5 text-left">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="font-medium text-[#FF4500]">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-20 text-center"
        style={{
          background: `linear-gradient(to right, ${primary}, #000)`,
        }}
      >
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-white mb-6"
        >
          Ready to Work With Us?
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 max-w-2xl mx-auto mb-8"
        >
          Let’s collaborate and create designs that make your brand unforgettable.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact"
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition transform hover:scale-105"
          >
            Get In Touch
          </Link>
          <Link
            to="/products"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition transform hover:scale-105"
          >
            View Our Work
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default About;
