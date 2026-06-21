import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaHeart, FaCalendarAlt, FaPalette, FaGraduationCap, FaMusic, FaBook, FaFilm, FaUtensils, FaPlane, FaCamera, FaUser, FaUsers } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

function Profile() {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState('bersama');

  const profileData = {
    bersama: {
      title: "Bersama",
      icon: <FaUsers />,
      image: "/Berdua.png",
      accent: "#c34a36",
      items: [
        { label: "Tanggal Jadian", value: "18 Juni 2023", icon: <FaCalendarAlt /> },
        { label: "Lagu Favorite", value: "Suka semua kecuali lagu jamet", icon: <FaMusic /> },
        { label: "Film Favorite", value: "Semua suka", icon: <FaFilm /> },
        { label: "Makanan Favorite", value: "Suka Semua Makanan Kalau Enak", icon: <FaUtensils /> },
        { label: "Tempat Favorite", value: "Home", icon: <FaPlane /> },
        { label: "Warna Favorite", value: "Biru & Pink", icon: <FaPalette /> },
      ]
    },
    dia: {
      title: "Dia",
      icon: <FaUser />,
      name: "Syafa",
      image: "/Syafa.png",
      accent: "#4e8397",
      items: [
        { label: "Tanggal Lahir", value: "22 Januari 2010", icon: <FaCalendarAlt /> },
        { label: "Hobi", value: "Membaca, Menulis, Marah-Marah", icon: <FaBook /> },
        { label: "Warna Kesukaan", value: "Biru & Pink", icon: <FaPalette /> },
        { label: "Cita-cita", value: "Belum pasti", icon: <FaGraduationCap /> },
        { label: "Makanan Favorit", value: "Suka Semua Makanan Kalau Enak", icon: <FaUtensils /> },
        { label: "Film Favorit", value: "Dracin And Drakor", icon: <FaFilm /> },
      ]
    },
    aku: {
      title: "Aku",
      icon: <FaUser />,
      name: "Galvin",
      image: "/Galvin.png",
      accent: "#ff8066",
      items: [
        { label: "Tanggal Lahir", value: "7 Oktober 2008", icon: <FaCalendarAlt /> },
        { label: "Hobi", value: "Coding, Musik, Gaming", icon: <FaCamera /> },
        { label: "Warna Kesukaan", value: "Biru & Pink", icon: <FaPalette /> },
        { label: "Cita-cita", value: "Full-stack Developer", icon: <FaGraduationCap /> },
        { label: "Makanan Favorit", value: "Nasi Goreng", icon: <FaUtensils /> },
        { label: "Film Favorit", value: "Dracin", icon: <FaFilm /> },
      ]
    }
  };

  // Scroll animation
  useEffect(() => {
    gsap.fromTo('.profile-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Card Component
  const ProfileCard = ({ data, isActive, onClick }) => {
    const accent = data.accent || "#c34a36";
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className={`relative cursor-pointer transition-all duration-300 ${isActive ? 'scale-105 ring-2 ring-white/20' : 'hover:scale-102'}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr max-content',
          gap: '0.25rem 1rem',
          padding: '16px',
          borderRadius: '40px',
          boxShadow: '0 20px 40px -14px rgba(0,0,0,0.25)',
          backgroundColor: '#fff',
          color: '#444',
          maxWidth: '380px',
          width: '100%',
        }}
      >
        {/* Thumbnail */}
        <div 
          style={{
            display: 'grid',
            gridRow: '1 / 2',
            gridColumn: '1 / -1',
          }}
        >
          <img 
            src={data.image} 
            alt={data.title}
            style={{
              gridArea: '1 / 1',
              width: '100%',
              height: '100%',
              aspectRatio: '400 / 210',
              borderRadius: '24px',
              objectFit: 'cover',
              filter: 'brightness(0.8) grayscale(1)',
              transition: 'all 0.35s cubic-bezier(0.19, 1, 0.22, 1)',
              ...(isHovered || isActive ? { filter: 'brightness(1) grayscale(0)' } : {})
            }}
          />
          <img 
            src={data.image} 
            alt={data.title}
            style={{
              gridArea: '1 / 1',
              width: '100%',
              height: '100%',
              aspectRatio: '400 / 210',
              borderRadius: '24px',
              objectFit: 'cover',
              clipPath: (isHovered || isActive) ? 'inset(0 round 24px)' : 'inset(100% round 24px)',
              transition: 'clip-path 0.35s cubic-bezier(0.19, 1, 0.22, 1)',
            }}
          />
        </div>

        {/* Category Tag */}
        <div
          style={{
            zIndex: 1,
            gridRow: '1 / 2',
            gridColumn: '1 / -1',
            placeSelf: 'start',
            position: 'relative',
            alignContent: 'center',
            minHeight: '32px',
            paddingBlock: '1em',
            paddingInline: '1.5em',
            borderEndEndRadius: '16px',
            backgroundColor: '#fff',
            filter: 'drop-shadow(6px 6px 3px rgba(0,0,0,0.15))',
            maxWidth: 'calc(100% - 48px)',
          }}
        >
          <span className="text-xs uppercase tracking-wider font-bold" style={{ color: accent }}>
            {data.title}
          </span>
        </div>

        {/* Name */}
        <h3
          style={{
            gridColumn: '1 / 2',
            alignSelf: 'center',
            paddingBlock: '0.5rem',
            fontSize: 'clamp(16px, 2cqi + 10px, 24px)',
            fontWeight: 700,
            margin: 0,
          }}
        >
          {data.name || 'Two Hearts'}
        </h3>

        {/* Icon Badge */}
        <div
          style={{
            gridColumn: '2 / 3',
            placeSelf: 'center end',
            paddingBlock: '0.5em',
            paddingInline: '1em',
            borderRadius: '9999px',
            backgroundColor: accent,
            color: '#fff',
            fontSize: '14px',
          }}
        >
          {data.icon}
        </div>
      </div>
    );
  };

  // Detail Item
  const DetailItem = ({ item }) => (
    <div className="profile-card relative overflow-hidden group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <div className="relative z-10 text-white/40 text-lg group-hover:text-white/60 transition-colors duration-300">
        {item.icon}
      </div>
      <div className="relative z-10 flex-1">
        <p className="text-gray-500 text-xs uppercase tracking-wider">{item.label}</p>
        <p className="text-white text-sm md:text-base font-medium">{item.value}</p>
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} id="profile" className="relative bg-gradient-to-b from-black via-gray-900/95 to-black py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3 text-pink-500/40">
              <FaHeart className="text-sm animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-light">Our Story</span>
              <FaHeart className="text-sm animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white tracking-wider mb-4">
            About Us
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent mx-auto"></div>
          <p className="text-gray-400 text-sm mt-4 max-w-2xl mx-auto font-light">
            Kenali kami lebih dekat melalui cerita dan momen yang kami bagikan
          </p>
        </div>

        {/* 3D Cards */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
          {Object.keys(profileData).map((key) => (
            <ProfileCard
              key={key}
              data={profileData[key]}
              isActive={activeTab === key}
              onClick={() => setActiveTab(key)}
            />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {Object.keys(profileData).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-2.5 rounded-full text-sm transition-all duration-300 ${
                activeTab === key
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/5'
                  : 'text-gray-500 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                {profileData[key].icon}
                {profileData[key].title}
              </span>
            </button>
          ))}
        </div>

        {/* Profile Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {activeTab === 'bersama' ? (
            <>
              <div className="space-y-4">
                {profileData.bersama.items.slice(0, 3).map((item, index) => (
                  <DetailItem key={index} item={item} />
                ))}
              </div>
              <div className="space-y-4">
                {profileData.bersama.items.slice(3).map((item, index) => (
                  <DetailItem key={index} item={item} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 rounded-full bg-gradient-to-br from-white/5 to-transparent border border-white/10 mb-4">
                    {profileData[activeTab].icon}
                  </div>
                  <h3 className="text-3xl md:text-4xl text-white font-light tracking-wider">
                    {profileData[activeTab].name}
                  </h3>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent mx-auto mt-3"></div>
                </div>
              </div>
              <div className="space-y-4 md:col-span-1">
                {profileData[activeTab].items.slice(0, 3).map((item, index) => (
                  <DetailItem key={index} item={item} />
                ))}
              </div>
              <div className="space-y-4 md:col-span-1">
                {profileData[activeTab].items.slice(3).map((item, index) => (
                  <DetailItem key={index} item={item} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Love Note */}
        <div className="mt-16 text-center"> 
          <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-500/5 to-purple-500/5 border border-white/10 hover:border-pink-500/20 transition-all duration-300 group">
            <p className="text-gray-400 text-sm tracking-wider group-hover:text-gray-300 transition-colors duration-300 flex items-center gap-3">
              <span>Two hearts, one beautiful story</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;