import React, { useState, useEffect } from 'react';
import { 
  FaBirthdayCake, 
  FaGift, 
  FaHeart, 
  FaStar, 
  FaMusic,
  FaCamera,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import { LuSparkles } from "react-icons/lu";

const Ultah = () => {
  const [currentPhase, setCurrentPhase] = useState('intro'); // intro, text, card
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showText, setShowText] = useState(false);

  // 9 foto untuk intro cinematic - GANTI DENGAN FOTO SYAFA
  const photos = [
    'https://picsum.photos/400/600?random=1',
    'https://picsum.photos/400/600?random=2',
    'https://picsum.photos/400/600?random=3',
    'https://picsum.photos/400/600?random=4',
    'https://picsum.photos/400/600?random=5',
    'https://picsum.photos/400/600?random=6',
    'https://picsum.photos/400/600?random=7',
    'https://picsum.photos/400/600?random=8',
    'https://picsum.photos/400/600?random=9',
  ];

  // Efek intro cinematic
  useEffect(() => {
    if (currentPhase === 'intro') {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => {
          if (prev >= photos.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentPhase('text');
              setShowText(true);
            }, 500);
            return prev;
          }
          return prev + 1;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [currentPhase, photos.length]);

  // Transisi dari teks ke kartu
  useEffect(() => {
    if (currentPhase === 'text' && showText) {
      const timer = setTimeout(() => {
        setCurrentPhase('card');
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [currentPhase, showText]);

  // Halaman-halaman buku dengan kata-kata untuk Syafa
  const pages = [
    {
      front: (
        <div style={styles.pageContent}>
          <FaBirthdayCake style={styles.iconLarge} />
          <h2 style={styles.pageTitle}>Happy Birthday Syafa!</h2>
          <p style={styles.pageText}>Hari ini adalah hari spesialmu</p>
          <p style={styles.swipeHint}>Swipe untuk membuka →</p>
        </div>
      ),
    },
    {
      front: (
        <div style={styles.pageContent}>
          <FaStar style={styles.iconMedium} />
          <h3 style={styles.pageSubtitle}>Untuk Syafa yang Luar Biasa</h3>
          <p style={styles.pageText}>
            Di hari ulang tahunmu ini, aku ingin mengucapkan selamat atas bertambahnya usiamu. 
            Semoga setiap langkahmu selalu diterangi kebahagiaan.
          </p>
        </div>
      ),
    },
    {
      front: (
        <div style={styles.pageContent}>
          <FaHeart style={styles.iconMedium} />
          <h3 style={styles.pageSubtitle}>Terima Kasih Sudah Ada</h3>
          <p style={styles.pageText}>
            Kehadiranmu membawa warna dan kehangatan bagi orang-orang di sekitarmu. 
            Tetaplah menjadi pribadi yang indah seperti sekarang.
          </p>
        </div>
      ),
    },
    {
      front: (
        <div style={styles.pageContent}>
          <FaGift style={styles.iconMedium} />
          <h3 style={styles.pageSubtitle}>Doa Terbaik Untukmu</h3>
          <p style={styles.pageText}>
            Semoga Allah senantiasa melimpahkan rahmat-Nya, memberikan kesehatan, 
            kesuksesan, dan kebahagiaan yang tak terhingga. Aamiin.
          </p>
        </div>
      ),
    },
    {
      front: (
        <div style={styles.pageContent}>
          <LuSparkles style={styles.iconLarge} />
          <h3 style={styles.pageSubtitle}>Selamat Ulang Tahun, Syafa!</h3>
          <p style={styles.pageText}>
            Terus bersinar dan jadilah inspirasi bagi banyak orang. 
            Kamu pantas mendapatkan semua hal baik di dunia ini!
          </p>
          <FaMusic style={styles.iconSmall} />
        </div>
      ),
    },
  ];

  const handleSwipe = (direction) => {
    if (direction === 'next' && currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Touch handling untuk swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleSwipe('next');
    } else if (isRightSwipe) {
      handleSwipe('prev');
    }
  };

  // Render Intro Cinematic
  if (currentPhase === 'intro') {
    return (
      <div style={styles.container}>
        <div style={styles.introContainer}>
          <img
            src={photos[currentPhotoIndex]}
            alt={`Photo ${currentPhotoIndex + 1}`}
            style={styles.introPhoto}
          />
          <div style={styles.overlay}>
            <FaCamera style={styles.introIcon} />
            <p style={styles.introText}>Dipersembahkan oleh...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Text Phase
  if (currentPhase === 'text') {
    return (
      <div style={styles.container}>
        <div style={styles.textContainer}>
          <FaStar style={styles.textIcon} />
          <h1 style={styles.mainTitle}>Untuk Syafa</h1>
          <p style={styles.subtitle}>Sebuah kejutan menantimu...</p>
          <LuSparkles style={styles.textIcon} />
        </div>
      </div>
    );
  }

  // Render Card Book Phase
  return (
    <div style={styles.container}>
      <div 
        style={styles.bookContainer}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Halaman kiri */}
        {currentPage > 0 && (
          <div style={styles.pageLeft}>
            <div style={styles.pageInner}>
              {pages[currentPage - 1].front}
            </div>
          </div>
        )}

        {/* Halaman kanan */}
        <div style={styles.pageRight}>
          <div style={styles.pageInner}>
            {pages[currentPage].front}
          </div>
          
          {/* Navigasi tanpa tombol - hanya indikator */}
          <div style={styles.navigation}>
            {currentPage > 0 && (
              <FaArrowLeft 
                style={styles.navIcon} 
                onClick={() => handleSwipe('prev')}
              />
            )}
            
            <div style={styles.pageIndicator}>
              {pages.map((_, index) => (
                <span
                  key={index}
                  style={{
                    ...styles.dot,
                    backgroundColor: index === currentPage ? '#ff6b9d' : '#ddd'
                  }}
                />
              ))}
            </div>

            {currentPage < pages.length - 1 && (
              <FaArrowRight 
                style={styles.navIcon} 
                onClick={() => handleSwipe('next')}
              />
            )}
          </div>

          <p style={styles.swipeHintBottom}>
            {currentPage < pages.length - 1 ? 'Swipe untuk melanjutkan' : '🎉 Selesai!'}
          </p>
        </div>

        {/* Efek lipatan buku */}
        <div style={styles.bookSpine}></div>
      </div>

      {/* Dekorasi */}
      <div style={styles.decoration}>
        <FaStar style={styles.decorIcon} />
      </div>
      <div style={{...styles.decoration, left: '15%', top: '10%'}}>
        <FaHeart style={styles.decorIcon} />
      </div>
      <div style={{...styles.decoration, right: '15%', top: '15%'}}>
        <FaGift style={styles.decorIcon} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden',
    position: 'relative',
  },
  
  // Intro styles
  introContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    animation: 'fadeIn 0.2s ease-in-out',
  },
  overlay: {
    position: 'absolute',
    bottom: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '25px 50px',
    borderRadius: '15px',
    textAlign: 'center',
  },
  introIcon: {
    fontSize: '40px',
    color: 'white',
    marginBottom: '10px',
  },
  introText: {
    color: 'white',
    fontSize: '26px',
    fontWeight: 'bold',
    margin: 0,
  },
  
  // Text phase styles
  textContainer: {
    textAlign: 'center',
    color: 'white',
    animation: 'fadeIn 1s ease-in-out',
  },
  textIcon: {
    fontSize: '50px',
    margin: '20px',
    animation: 'pulse 2s infinite',
  },
  mainTitle: {
    fontSize: '56px',
    marginBottom: '20px',
    textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '26px',
    opacity: 0.95,
    fontStyle: 'italic',
  },
  
  // Book styles
  bookContainer: {
    position: 'relative',
    width: '90%',
    maxWidth: '650px',
    height: '75vh',
    display: 'flex',
    perspective: '1500px',
  },
  pageLeft: {
    flex: 1,
    backgroundColor: '#fffef5',
    borderRadius: '10px 0 0 10px',
    boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.1)',
    marginRight: '-5px',
    zIndex: 1,
    border: '2px solid #e0e0e0',
  },
  pageRight: {
    flex: 1,
    backgroundColor: '#fffef5',
    borderRadius: '0 10px 10px 0',
    boxShadow: '10px 10px 30px rgba(0,0,0,0.2), inset 10px 0 20px rgba(0,0,0,0.1)',
    marginLeft: '-5px',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '40px 30px',
    position: 'relative',
    border: '2px solid #e0e0e0',
  },
  pageInner: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookSpine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '12px',
    backgroundColor: 'rgba(0,0,0,0.15)',
    transform: 'translateX(-50%)',
    zIndex: 3,
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  },
  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  iconLarge: {
    fontSize: '60px',
    color: '#764ba2',
    marginBottom: '20px',
  },
  iconMedium: {
    fontSize: '45px',
    color: '#667eea',
    marginBottom: '15px',
  },
  iconSmall: {
    fontSize: '30px',
    color: '#ff6b9d',
    marginTop: '15px',
  },
  pageTitle: {
    fontSize: '36px',
    color: '#764ba2',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pageSubtitle: {
    fontSize: '26px',
    color: '#667eea',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
  },
  pageText: {
    fontSize: '18px',
    color: '#555',
    textAlign: 'center',
    lineHeight: '1.8',
    paddingHorizontal: '10px',
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  navIcon: {
    fontSize: '24px',
    color: '#764ba2',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  pageIndicator: {
    display: 'flex',
    gap: '10px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'background-color 0.3s',
  },
  swipeHint: {
    marginTop: '25px',
    fontSize: '16px',
    color: '#999',
    fontStyle: 'italic',
  },
  swipeHintBottom: {
    fontSize: '14px',
    color: '#aaa',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  
  // Decorations
  decoration: {
    position: 'absolute',
    fontSize: '35px',
    animation: 'float 3s ease-in-out infinite',
  },
  decorIcon: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '35px',
  },
};

// Tambahkan keyframes untuk animasi
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(styleSheet);

export default Ultah;
