import {
  CheckCircleIcon,
  UserGroupIcon,
  TrophyIcon,
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

  const team = [
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

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F]">

      {/* 🔥 HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center">
        <img
          src={Abouthero}
          alt="About Shree Graphics"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            About{" "}
            <span
              className="font-extrabold"
              style={{ color: primary }}
            >
              Shree Graphics
            </span>
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            We are a team of creative designers and embroidery experts committed
            to crafting unique and impactful brand identities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              style={{ backgroundColor: primary }}
              className="text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
            >
              Get In Touch
            </a>

            <a
              href="/products"
              style={{
                borderColor: primary,
                color: primary,
              }}
              className="border-2 px-8 py-3 rounded-lg font-semibold hover:text-white hover:bg-[#FF4500] transition"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>

      {/* 📊 STATS */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-transparent hover:border-[#FF4500] transition"
            >
              <div
                className="text-4xl font-extrabold mb-2"
                style={{ color: primary }}
              >
                {stat.value}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧵 OUR STORY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: primary }}
            >
              Our Story
            </h2>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Founded in 2014,{" "}
              <span className="font-semibold">Shree Graphics Design</span> began
              with a passion for embroidery and brand storytelling. What started
              as a small creative workshop has evolved into a nationwide design
              hub.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe every brand deserves to be remembered — our mission is
              to turn ideas into art stitched with excellence.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c"
              alt="Studio"
              className="rounded-2xl shadow-xl hover:scale-105 transition"
            />
          </div>
        </div>
      </section>

      {/* 💎 CORE VALUES */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: primary }}
          >
            Our Core Values
          </h2>
          <p className="text-gray-600 mb-12">
            These principles drive every decision and design we make.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {values.map((value, i) => (
              <div
                key={i}
                className="p-10 bg-white rounded-2xl shadow border border-transparent hover:border-[#FF4500] hover:shadow-lg transition"
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FFF4F0" }}
                >
                  <value.icon
                    className="h-8 w-8"
                    style={{ color: primary }}
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 TEAM */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: primary }}
          >
            Meet Our Leadership Team
          </h2>

          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            A talented group of creative minds leading our design excellence.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow border border-transparent hover:border-[#FF4500] hover:shadow-lg transition"
              >
                <img
                  src={member.image}
                  className="w-full h-64 object-cover rounded-t-2xl"
                  alt={member.name}
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="font-medium" style={{ color: secondary }}>
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-center"
        style={{
          background: `linear-gradient(to right, ${primary}, #000)`,
        }}
      >
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Work With Us?
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Let’s collaborate and create designs that make your brand unforgettable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
          >
            Get In Touch
          </a>
          <a
            href="/products"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
          >
            View Our Work
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
