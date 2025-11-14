import { CheckCircleIcon, UserGroupIcon, TrophyIcon } from '@heroicons/react/24/outline'
import Shailesh from '../assets/images/Shailesh.png'
import Sheela from '../assets/images/Sheela.png'
import Shubham from '../assets/images/Shubham.png'
import Sunil from '../assets/images/Sunil.png'
import Kavita from '../assets/images/Kavita.png'
import Abouthero from '../assets/images/abouthero.jpg'

const About = () => {
  const stats = [
    { label: 'Happy Clients', value: '500+' },
    { label: 'Projects Completed', value: '1000+' },
    { label: 'Years Experience', value: '10+' },
    { label: 'Team Members', value: '15+' }
  ]

  const values = [
    {
      icon: CheckCircleIcon,
      title: 'Quality First',
      description: 'We never compromise on quality and ensure every design meets the highest standards.'
    },
    {
      icon: UserGroupIcon,
      title: 'Customer Focused',
      description: 'Our clients are at the heart of everything we do. We listen, understand, and deliver.'
    },
    {
      icon: TrophyIcon,
      title: 'Creative Excellence',
      description: 'We push creative boundaries to deliver unique and memorable design solutions.'
    }
  ]

  const team = [
    {
      name: 'Sunil Gopale',
      role: 'CEO - Marketing (India Region)',
      image: Sunil,
      description: 'Oversees marketing strategies and operations in India.'
    },
    {
      name: 'Shailesh L',
      role: 'CEO & Founder',
      image: Shailesh,
      description: 'Founder of the company, driving vision and growth.'
    },
    {
      name: 'Shubham Mane',
      role: 'Co-Founder & MD',
      image: Shubham,
      description: 'Manages overall operations and strategic decisions.'
    },
    {
      name: 'Kavita Gopale',
      role: 'Delivery Head (India)',
      image: Kavita,
      description: 'Responsible for timely delivery and project execution in India.'
    },
    {
      name: 'Sheela Lanke',
      role: 'Operation Head (India)',
      image: Sheela,
      description: 'Oversees daily operations and team management in India.'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white scroll-smooth">

      {/* 🧭 Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <img
          src={Abouthero}
          alt="About Shree Graphics Design – embroidery and branding team"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-red-950/80"></div>

        <div className="relative z-10 px-6 sm:px-8 md:px-12 max-w-4xl mx-auto text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            About <span className="text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">Shree Graphics</span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            We are a team of creative designers and embroidery experts committed to crafting unique and impactful brand identities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.5)]"
            >
              Get In Touch
            </a>
            <a
              href="/products"
              className="border-2 border-red-500 text-red-400 px-8 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>

      {/* 📈 Stats Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-2xl border border-red-900/40 shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,0,0,0.4)] transition-transform hover:-translate-y-2"
            >
              <div className="text-4xl font-extrabold text-red-500 mb-2">{stat.value}</div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧵 Our Story */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-red-500">Our Story</h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Founded in 2014, <span className="text-white font-semibold">Shree Graphics Design</span> began with a passion for embroidery and brand storytelling. What started as a small creative workshop has evolved into a nationwide brand design hub.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              We believe every brand deserves to be remembered — our mission is to turn ideas into art stitched with excellence.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
              alt="Shree Graphics Design Studio workspace"
              className="rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.3)] hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 💎 Core Values */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-red-500">Our Core Values</h2>
          <p className="text-lg text-gray-400 mb-12">
            These principles drive every decision and design we make.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, i) => (
              <div
                key={i}
                className="p-10 bg-gradient-to-b from-zinc-900 to-black rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.2)] border border-red-900/30 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]"
              >
                <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 Team Section */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-red-500">Meet Our Leadership Team</h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            A talented group of creative minds leading our design excellence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-zinc-900 to-black rounded-2xl overflow-hidden border border-red-900/40 shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] hover:-translate-y-2 transition-all"
              >
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-red-400 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-snug">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-700 to-black text-center text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let’s collaborate and create designs that make your brand unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-semibold shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all"
            >
              Get In Touch
            </a>
            <a
              href="/products"
              className="border-2 border-red-400 text-red-400 px-8 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
