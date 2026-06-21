import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FaInstagram, FaEnvelope, FaArrowUp, FaTiktok, FaTimes, 
  FaHandPaper, FaList, FaCheck, FaTicketAlt, FaBrain,
  FaHeart, FaRegHeart, FaStar, FaRedo, FaTrophy, FaClock,
  FaGem, FaSun, FaMoon, FaCloud, FaLeaf, FaFeather,
  FaDove, FaRing
} from 'react-icons/fa';
import { 
  GiSelfLove, GiRose, GiLovers, 
  GiLoveSong, GiLoveLetter,
  GiHeartNecklace
} from 'react-icons/gi';
import { PiChatTeardropText } from "react-icons/pi";

function Footer() {
  // State untuk Mesin Capit
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isPrizeListOpen, setIsPrizeListOpen] = useState(false);
  const [isPrizePopupOpen, setIsPrizePopupOpen] = useState(false);
  const [clawPosition, setClawPosition] = useState(50);
  const [clawY, setClawY] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [hasItem, setHasItem] = useState(false);
  const [caughtItem, setCaughtItem] = useState(null);
  const [score, setScore] = useState(0);
  const [prizes, setPrizes] = useState([]);
  const [message, setMessage] = useState('');
  const [ticketNumber, setTicketNumber] = useState(1);
  const [claimedPrizes, setClaimedPrizes] = useState([]);
  const [lastTicket, setLastTicket] = useState(null);
  
  // State untuk Memory Match
  const [isMemoryGameOpen, setIsMemoryGameOpen] = useState(false);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [memoryScore, setMemoryScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('memoryLoveGameBestScore');
    return saved ? parseInt(saved) : null;
  });
  
  const dropInterval = useRef(null);
  const riseInterval = useRef(null);
  const timerRef = useRef(null);
  const holePosition = 85;

  // Daftar hadiah dengan nomor - PAKE REACT ICON
  const prizeList = [
    { number: 1, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 2, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 3, name: 'Sari Gandum', icon: <FaGem className="text-yellow-500/60 text-2xl" />, type: 'snack' },
    { number: 4, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 5, name: 'Ciki Asin', icon: <FaSun className="text-yellow-400/60 text-2xl" />, type: 'snack' },
    { number: 6, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 7, name: 'Permen', icon: <FaStar className="text-pink-400/60 text-2xl" />, type: 'snack' },
    { number: 8, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 9, name: 'Ciki Pedas', icon: <FaHeart className="text-red-400/60 text-2xl" />, type: 'snack' },
    { number: 10, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 11, name: 'Coklat', icon: <FaLeaf className="text-green-400/60 text-2xl" />, type: 'snack' },
    { number: 12, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 13, name: 'Kerupuk', icon: <FaMoon className="text-blue-400/60 text-2xl" />, type: 'snack' },
    { number: 14, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 15, name: 'Kue', icon: <FaCloud className="text-white/40 text-2xl" />, type: 'snack' },
    { number: 16, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 17, name: 'Ciki Keju', icon: <FaFeather className="text-white/40 text-2xl" />, type: 'snack' },
    { number: 18, name: 'ZONK', icon: <FaTimes className="text-red-500/40 text-2xl" />, type: 'zonk' },
    { number: 19, name: 'Biskuit', icon: <FaGem className="text-purple-400/60 text-2xl" />, type: 'snack' },
    { number: 20, name: 'SURAT CINTA', icon: <GiLoveLetter className="text-pink-400 text-2xl" />, type: 'jackpot' },
  ];

  // Daftar ikon cinta untuk Memory Match - SEMUA PASTI TERSEDIA
  const loveIcons = [
    { id: 1, name: 'Hati', icon: FaHeart, color: '#FF4757' },
    { id: 2, name: 'Mawar', icon: GiRose, color: '#FF6B81' },
    { id: 3, name: 'Pasangan', icon: GiLovers, color: '#FF6B6B' },
    { id: 4, name: 'Lagu Cinta', icon: GiLoveSong, color: '#FF8A8A' },
    { id: 5, name: 'Merpati', icon: FaDove, color: '#A8D8EA' },
    { id: 6, name: 'Cincin', icon: FaRing, color: '#FFD700' },
    { id: 8, name: 'Surat Cinta', icon: GiLoveLetter, color: '#FF6B8A' },
  ];

  // ============ MESIN CAPIT FUNCTIONS ============
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePrizes = useCallback(() => {
    const newPrizes = [];
    for (let i = 0; i < 12; i++) {
      newPrizes.push({
        id: i,
        x: 10 + Math.random() * 80,
        y: 60 + Math.random() * 28,
        caught: false,
        size: 20 + Math.random() * 10
      });
    }
    setPrizes(newPrizes);
  }, []);

  const startGame = () => {
    setIsGameOpen(true);
    setScore(0);
    setCaughtItem(null);
    setHasItem(false);
    setClawPosition(50);
    setClawY(0);
    setIsMoving(false);
    setMessage('');
    setTicketNumber(1);
    setClaimedPrizes([]);
    setLastTicket(null);
    if (dropInterval.current) clearInterval(dropInterval.current);
    if (riseInterval.current) clearInterval(riseInterval.current);
    generatePrizes();
  };

  const closeGame = () => {
    setIsGameOpen(false);
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 20) + 1;
  };

  const moveClaw = (direction) => {
    if (isMoving) {
      setMessage('Tunggu sebentar!');
      return;
    }
    
    setClawPosition(prev => {
      let newPos = prev + (direction === 'left' ? -4 : 4);
      if (newPos < 8) newPos = 8;
      if (newPos > 92) newPos = 92;
      return newPos;
    });
  };

  const startDrop = () => {
    if (isMoving) return;
    if (hasItem) {
      setMessage('Capit sedang membawa love! Naikkan dulu');
      return;
    }
    if (clawY > 0) {
      setMessage('Capit sudah di bawah! Tekan ↑');
      return;
    }
    
    setIsMoving(true);
    setMessage('Menurunkan capit...');
    
    dropInterval.current = setInterval(() => {
      setClawY(prev => {
        const newY = prev + 3;
        
        if (newY >= 50 && newY <= 60 && !hasItem) {
          const caughtPrize = prizes.find(p => 
            !p.caught && 
            Math.abs(p.x - clawPosition) < 8 && 
            p.y > 60 && p.y < 82
          );
          
          if (caughtPrize) {
            setHasItem(true);
            setCaughtItem(caughtPrize.id);
            setPrizes(prevPrizes => prevPrizes.map(p => 
              p.id === caughtPrize.id ? { ...p, caught: true } : p
            ));
            setMessage('Dapat love! Tekan ↑');
          }
        }
        
        if (newY >= 65) {
          clearInterval(dropInterval.current);
          dropInterval.current = null;
          setIsMoving(false);
          if (!hasItem) {
            setMessage('Gak dapet. Tekan ↑');
          }
          return 65;
        }
        
        return newY;
      });
    }, 30);
  };

  const startRise = () => {
    if (isMoving) return;
    if (clawY === 0) {
      setMessage('Capit sudah di atas!');
      return;
    }
    
    setIsMoving(true);
    setMessage('Menaikkan capit...');
    
    riseInterval.current = setInterval(() => {
      setClawY(prev => {
        const newY = prev - 3;
        
        if (newY <= 0) {
          clearInterval(riseInterval.current);
          riseInterval.current = null;
          setIsMoving(false);
          setClawY(0);
          
          if (hasItem) {
            setMessage('Naik! Geser ke lubang (← →)');
          } else {
            setMessage('Siap ambil lagi!');
          }
          return 0;
        }
        
        return newY;
      });
    }, 30);
  };

  const dropToHole = () => {
    if (isMoving) return;
    if (!hasItem) {
      setMessage('Ambil love dulu!');
      return;
    }
    if (clawY > 0) {
      setMessage('Naikkan dulu ke atas!');
      return;
    }
    
    if (Math.abs(clawPosition - holePosition) > 8) {
      setMessage(`Geser ke lubang! (${Math.round(clawPosition)}% → 85%)`);
      return;
    }
    
    setIsMoving(true);
    setMessage('Love masuk lubang...');
    
    dropInterval.current = setInterval(() => {
      setClawY(prev => {
        const newY = prev + 3;
        
        if (newY >= 45) {
          clearInterval(dropInterval.current);
          dropInterval.current = null;
          
          const number = getRandomNumber();
          const prize = prizeList.find(p => p.number === number);
          
          setLastTicket(number);
          setClaimedPrizes(prev => [...prev, number]);
          setTicketNumber(prev => prev + 1);
          setScore(prev => prev + 1);
          setHasItem(false);
          setCaughtItem(null);
          
          setTimeout(() => {
            const riseAgain = setInterval(() => {
              setClawY(prevY => {
                const newY = prevY - 3;
                if (newY <= 0) {
                  clearInterval(riseAgain);
                  setIsMoving(false);
                  setClawY(0);
                  
                  if (number === 20) {
                    setIsLetterOpen(true);
                    setIsGameOpen(false);
                  } else {
                    setIsPrizePopupOpen(true);
                  }
                  
                  return 0;
                }
                return newY;
              });
            }, 30);
          }, 300);
          
          return 45;
        }
        
        return newY;
      });
    }, 30);
  };

  // ============ MEMORY MATCH FUNCTIONS ============
  const initializeMemoryGame = useCallback(() => {
    const deck = [];
    loveIcons.forEach((item, index) => {
      deck.push({ ...item, pairId: index, matched: false });
      deck.push({ ...item, pairId: index, matched: false });
    });
    
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setMemoryCards(shuffled);
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsLocked(false);
    setGameComplete(false);
    setTimer(0);
    setIsTimerRunning(false);
    setMemoryScore(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startMemoryGame = () => {
    setIsMemoryGameOpen(true);
    initializeMemoryGame();
  };

  const closeMemoryGame = () => {
    setIsMemoryGameOpen(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (matchedPairs.length === loveIcons.length && matchedPairs.length > 0) {
      setGameComplete(true);
      setIsTimerRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const finalScore = Math.max(0, 100 - (moves * 2) - Math.floor(timer / 5));
      setMemoryScore(finalScore);
      
      if (bestScore === null || finalScore > bestScore) {
        localStorage.setItem('memoryLoveGameBestScore', finalScore.toString());
        setBestScore(finalScore);
      }
    }
  }, [matchedPairs, moves, timer, bestScore]);

  const startMemoryTimer = () => {
    if (!isTimerRunning && !gameComplete) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
  };

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (flippedIndexes.includes(index)) return;
    if (memoryCards[index].matched) return;
    if (flippedIndexes.length === 2) return;

    if (moves === 0 && !gameComplete) {
      startMemoryTimer();
    }

    const newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(prev => prev + 1);

      const card1 = memoryCards[newFlipped[0]];
      const card2 = memoryCards[newFlipped[1]];

      if (card1.pairId === card2.pairId) {
        setMatchedPairs(prev => [...prev, card1.pairId]);
        setMemoryCards(prevCards => 
          prevCards.map((card, idx) => 
            idx === newFlipped[0] || idx === newFlipped[1] 
              ? { ...card, matched: true } 
              : card
          )
        );
        setFlippedIndexes([]);
        setIsLocked(false);
      } else {
        setTimeout(() => {
          setFlippedIndexes([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  const getMemoryCardIcon = (card) => {
    const Icon = card.icon;
    return <Icon className="text-4xl md:text-5xl" style={{ color: card.color }} />;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isNumberClaimed = (number) => {
    return claimedPrizes.includes(number);
  };

  // Cleanup intervals
  useEffect(() => {
    return () => {
      if (dropInterval.current) clearInterval(dropInterval.current);
      if (riseInterval.current) clearInterval(riseInterval.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isGameOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveClaw('left');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveClaw('right');
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hasItem && clawY === 0) {
          dropToHole();
        } else if (!hasItem && clawY === 0) {
          startDrop();
        }
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (clawY > 0) {
          startRise();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOpen, hasItem, clawY, clawPosition]);

  return (
    <footer className="border-t border-white/10 py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4">
              <GiSelfLove className="text-white text-sm" />
            </div>

            <h4 className="text-white text-xs uppercase tracking-wider mb-4">
              Untuk Syafa
            </h4>

            <button
              onClick={startGame}
              className="border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 px-6 py-3 transition-all duration-300 mx-auto md:mx-0 flex items-center justify-center gap-2"
            >
              <FaHandPaper className="text-white/60 text-sm" />
              <span className="text-white/70 text-sm tracking-wide">
                Main Mesin Capit
              </span>
            </button>
            <p className="text-white/30 text-[10px] mt-2">← → geser | ↓ ambil | ↑ naik | ↓ masukin lubang</p>
          </div>
          
          <div className="text-center">
            <h4 className="text-white text-xs uppercase tracking-wider mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-white text-sm transition-colors">
                Home
              </button>
              <button onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-white text-sm transition-colors">
                Gallery
              </button>
              <button onClick={() => document.getElementById('love-message')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-white text-sm transition-colors">
                Story
              </button>
              <button
                onClick={startMemoryGame}
                className="text-white/40 hover:text-white text-sm transition-colors flex items-center justify-center gap-1"
              >
                <FaBrain className="text-[10px]" />
                <span>Memory Love</span>
              </button>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="text-white text-xs uppercase tracking-wider mb-3">Connect</h4>
            <div className="flex justify-center md:justify-end gap-4 mb-4">
              <a href="https://whatsapp.com/channel/0029Vb7NjyQ1dAw42SWIzH0m" className="text-white/30 hover:text-white transition-all duration-300">
                <PiChatTeardropText size={18} />
              </a>
              <a href="https://www.instagram.com/vinsyaaaaaaaaaa227" className="text-white/30 hover:text-white transition-all duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="mailto:vinsyaa227@gmail.com" className="text-white/30 hover:text-white transition-all duration-300">
                <FaEnvelope size={18} />
              </a>
              <a href="https://www.tiktok.com/@vinsyaaaaaaaaaa227" className="text-white/30 hover:text-white transition-all duration-300">
                <FaTiktok size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-white/10 my-6"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-white/30 text-xs tracking-wider">
              Gallery by <a href="https://galvinalfitov2.vercel.app" className="text-pink-300 hover:text-white transition-colors">Galvin</a>
            </p>
          </div>
          
          <div className="text-white text-xs tracking-wider">
            © 2026 • All memories reserved
          </div>
          
          <button onClick={scrollToTop} className="flex items-center gap-2 text-white/30 hover:text-white text-xs transition-all duration-300">
            Back to top
            <FaArrowUp size={12} />
          </button>
        </div>
      </div>

      {/* GAME MESIN CAPIT */}
      {isGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={closeGame}></div>
          
          <div className="relative z-10 w-full max-w-2xl bg-black border border-white/20 shadow-2xl">
            <button onClick={closeGame} className="absolute top-4 right-4 text-white/40 hover:text-white/70 z-20">
              <FaTimes size={18} />
            </button>
            
            <div className="border-b border-white/10 py-4 px-5">
              <div className="flex justify-between items-center">
                <h3 className="text-white/70 text-sm tracking-widest uppercase">Mesin Capit</h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPrizeListOpen(true)}
                    className="text-white/40 hover:text-white/70 text-xs flex items-center gap-1"
                  >
                    <FaList /> List Hadiah
                  </button>
                  <span className="text-white/30 text-xs">|</span>
                  <span className="text-white/30 text-xs">Ticket: #{ticketNumber - 1}</span>
                </div>
              </div>
              {hasItem && clawY === 0 && (
                <p className="text-white/40 text-center text-[10px] mt-1 animate-pulse">✦ Membawa love! Geser ke lubang → ✦</p>
              )}
            </div>
            
            <div className="p-6">
              <div className="relative bg-gradient-to-b from-gray-950 to-black border border-white/20 h-[450px] overflow-hidden rounded-lg shadow-inner">
                
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                {/* Lubang */}
                <div className="absolute bottom-44 right-8 w-20 h-10">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-full border-2 border-white/30 shadow-lg"></div>
                  <div className="absolute inset-1 bg-black rounded-full border border-white/20"></div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white/30 text-[8px] tracking-wider whitespace-nowrap">LUBANG</div>
                  <div className="absolute -inset-2 rounded-full bg-white/5 blur-xl"></div>
                </div>
                
                <div className="absolute bottom-16 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent"></div>
                
                {/* LOVE */}
                {prizes.map(prize => !prize.caught && (
                  <div
                    key={prize.id}
                    className="absolute transform -translate-x-1/2"
                    style={{ 
                      left: `${prize.x}%`, 
                      top: `${prize.y}%`,
                      filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                    }}
                  >
                    <GiSelfLove 
                      className="text-white/50" 
                      style={{ fontSize: `${prize.size}px` }}
                    />
                  </div>
                ))}
                
                {/* Love yang dipegang capit */}
                {hasItem && caughtItem && clawY > 30 && (
                  <div
                    className="absolute transform -translate-x-1/2 transition-all duration-100"
                    style={{ left: `${clawPosition}%`, top: `${35 + clawY * 0.5}%` }}
                  >
                    <GiSelfLove className="text-white/80 text-3xl filter drop-shadow(0 0 15px white)" />
                  </div>
                )}
                
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                {/* CAPIT */}
                <div
                  id="claw"
                  className="absolute transition-all duration-100"
                  style={{ left: `${clawPosition}%`, top: `${clawY}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="relative flex flex-col items-center">
                    <div 
                      className="w-0.5 mx-auto transition-all duration-100"
                      style={{ 
                        height: `${Math.max(10, 40 - clawY * 0.5)}px`,
                        background: `linear-gradient(to bottom, 
                          rgba(255,255,255,0.6) 0%, 
                          rgba(255,255,255,0.4) ${clawY > 30 ? 60 : 30}%, 
                          rgba(255,255,255,0.1) 100%)`,
                      }}
                    ></div>
                    
                    <div className="relative -mt-1">
                      <div className="w-10 h-6 bg-gradient-to-b from-white/20 to-white/5 border border-white/30 rounded-b-lg shadow-lg backdrop-blur-sm">
                        <div className="absolute inset-0 flex flex-col justify-around px-1">
                          <div className="w-full h-px bg-white/20"></div>
                          <div className="w-full h-px bg-white/20"></div>
                          <div className="w-full h-px bg-white/20"></div>
                        </div>
                        <div className="absolute inset-0 flex justify-around">
                          <div className="w-px h-full bg-white/20"></div>
                          <div className="w-px h-full bg-white/20"></div>
                          <div className="w-px h-full bg-white/20"></div>
                        </div>
                      </div>
                      
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-3 border-2 border-white/30 rounded-t-full border-b-0"></div>
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/30 rounded-full"></div>
                    </div>
                    
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Tombol kontrol */}
              <div className="mt-4 flex justify-center gap-3 flex-wrap">
                <button onClick={() => moveClaw('left')} disabled={isMoving} className="border border-white/20 px-4 py-2 text-white/60 hover:bg-white/10 hover:scale-105 transition-all disabled:opacity-30 text-sm rounded-md">
                  ← Kiri
                </button>
                <button onClick={() => moveClaw('right')} disabled={isMoving} className="border border-white/20 px-4 py-2 text-white/60 hover:bg-white/10 hover:scale-105 transition-all disabled:opacity-30 text-sm rounded-md">
                  Kanan →
                </button>
                <button onClick={startDrop} disabled={isMoving || hasItem || clawY > 0} className="border border-white/20 px-4 py-2 text-white/60 hover:bg-white/10 hover:scale-105 transition-all disabled:opacity-30 text-sm rounded-md">
                  ↓ Ambil
                </button>
                <button onClick={startRise} disabled={isMoving || clawY === 0} className="border border-white/20 px-4 py-2 text-white/60 hover:bg-white/10 hover:scale-105 transition-all disabled:opacity-30 text-sm rounded-md">
                  ↑ Naik
                </button>
              </div>
              
              {hasItem && clawY === 0 && (
                <div className="mt-3 flex justify-center">
                  <button onClick={dropToHole} disabled={isMoving} className="border border-white/30 px-5 py-2 text-white/80 hover:bg-white/10 hover:scale-105 transition-all text-sm rounded-md shadow-md">
                    ⬇ Masukkan Lubang ⬇
                  </button>
                </div>
              )}
              
              {message && (
                <div className="mt-4 text-center">
                  <p className="text-white/40 text-xs border-t border-white/10 pt-3 animate-pulse">{message}</p>
                </div>
              )}
              
              <p className="text-white/20 text-center text-[10px] mt-3">
                ← → geser | ↓ ambil love | ↑ naikkan | ↓ masukkan ke lubang
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MEMORY MATCH GAME */}
      {isMemoryGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={closeMemoryGame}></div>
          
          <div className="relative z-10 w-full max-w-2xl bg-black border border-white/20 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={closeMemoryGame} className="absolute top-4 right-4 text-white/40 hover:text-white/70 z-20">
              <FaTimes size={18} />
            </button>
            
            {/* Header */}
            <div className="border-b border-white/10 py-4 px-6">
              <h3 className="text-white/70 text-center text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                <FaHeart className="text-pink-400" />
                <span>Memory Love</span>
                <FaHeart className="text-pink-400" />
              </h3>
              <p className="text-white/20 text-center text-[10px] mt-1">
                Cocokkan simbol cinta yang sama
              </p>
            </div>
            
            {/* Stats */}
            <div className="px-6 py-3 border-b border-white/10 flex justify-between items-center text-xs">
              <div className="flex items-center gap-3">
                <span className="text-white/30">Moves: <span className="text-white/60">{moves}</span></span>
                <span className="text-white/20">|</span>
                <span className="text-white/30 flex items-center gap-1">
                  <FaClock className="text-[10px]" />
                  <span className="text-white/60">{formatTime(timer)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/30">
                  Matched: <span className="text-white/60">{matchedPairs.length}/{loveIcons.length}</span>
                </span>
                {bestScore !== null && (
                  <>
                    <span className="text-white/20">|</span>
                    <span className="text-white/30 flex items-center gap-1">
                      <FaStar className="text-yellow-500/40 text-[10px]" />
                      <span className="text-white/40">{bestScore}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Grid Cards */}
            <div className="p-6">
              <div className="grid grid-cols-4 gap-3">
                {memoryCards.map((card, index) => {
                  const isFlipped = flippedIndexes.includes(index) || card.matched;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleCardClick(index)}
                      disabled={card.matched || isLocked}
                      className={`
                        aspect-square rounded-xl transition-all duration-300 relative
                        ${isFlipped 
                          ? 'bg-white/5 border border-white/20' 
                          : 'bg-gradient-to-br from-pink-900/30 to-pink-950/20 border border-pink-500/20 hover:border-pink-500/50 hover:scale-105'
                        }
                        ${card.matched ? 'border-pink-500/30 bg-pink-500/5' : ''}
                        transform hover:shadow-lg
                      `}
                    >
                      {isFlipped ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {getMemoryCardIcon(card)}
                          {card.matched && (
                            <div className="absolute -top-1 -right-1">
                              <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center">
                                <FaHeart className="text-pink-400 text-[8px]" />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                            <GiSelfLove className="text-pink-500/30 text-xl" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Tips */}
              <div className="mt-4 text-center">
                <p className="text-white/20 text-[10px] tracking-wider">
                  {moves === 0 ? 'Klik kartu untuk mulai! ❤️' : 'Cocokkan simbol cinta yang sama ❤️'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMORY GAME RESULT */}
      {gameComplete && isMemoryGameOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95" onClick={closeMemoryGame}></div>
          
          <div className="relative z-10 max-w-md w-full bg-black border border-white/20 shadow-2xl rounded-2xl animate-slideUp">
            <button onClick={closeMemoryGame} className="absolute top-4 right-4 text-white/40 hover:text-white/70 z-20">
              <FaTimes size={18} />
            </button>
            
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/30 flex items-center justify-center mx-auto">
                  <FaHeart className="text-pink-400 text-4xl" />
                </div>
              </div>
              
              <h2 className="text-2xl text-white font-light tracking-wide mb-2">
                 Sempurna! 
              </h2>
              <p className="text-white/40 text-sm mb-6">
                Kamu berhasil mencocokkan semua simbol cinta!
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">Moves</p>
                  <p className="text-white text-lg font-light">{moves}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">Time</p>
                  <p className="text-white text-lg font-light">{formatTime(timer)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">Score</p>
                  <p className="text-pink-400 text-lg font-light">{memoryScore}</p>
                </div>
              </div>
              
              {bestScore !== null && (
                <p className="text-white/20 text-xs mb-4">
                  Best Score: {bestScore}
                </p>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={initializeMemoryGame}
                  className="flex-1 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 py-3 rounded-lg text-white/70 hover:text-white text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaRedo />
                  Main Lagi
                </button>
                <button
                  onClick={closeMemoryGame}
                  className="flex-1 border border-white/10 hover:border-white/30 py-3 rounded-lg text-white/40 hover:text-white/60 text-sm tracking-wider transition-all duration-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP NOMOR UNDIAN */}
      {isPrizePopupOpen && lastTicket !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={() => setIsPrizePopupOpen(false)}></div>
          
          <div className="relative z-10 max-w-sm w-full bg-black border border-white/20 shadow-2xl animate-slideUp">
            <button onClick={() => setIsPrizePopupOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white/70 z-20">
              <FaTimes size={18} />
            </button>
            
            <div className="p-8 text-center">
              <div className="text-5xl mb-3 flex justify-center">
                <FaTicketAlt className="text-white/40" />
              </div>
              <h3 className="text-white/70 text-sm tracking-widest uppercase mb-2">Nomor Undian</h3>
              <div className="text-7xl font-bold text-white/80 mb-4 py-4 border-y border-white/10">
                #{String(lastTicket).padStart(2, '0')}
              </div>
              <p className="text-white/30 text-xs">
                Cek List Hadiah untuk lihat hadiahnya!
              </p>
              
              <button 
                onClick={() => setIsPrizePopupOpen(false)}
                className="mt-4 border border-white/20 px-6 py-2 text-white/60 hover:bg-white/10 transition-all text-sm rounded-md"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST HADIAH */}
      {isPrizeListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={() => setIsPrizeListOpen(false)}></div>
          
          <div className="relative z-10 max-w-md w-full bg-black border border-white/20 shadow-2xl max-h-[80vh]">
            <button onClick={() => setIsPrizeListOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white/70 z-20">
              <FaTimes size={18} />
            </button>
            
            <div className="border-b border-white/10 py-4 px-5">
              <h3 className="text-white/70 text-center text-sm tracking-widest uppercase">List Hadiah</h3>
              <p className="text-white/30 text-center text-xs mt-1">Total undian: {claimedPrizes.length} kali</p>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-2">
                {prizeList.map((prize) => {
                  const claimed = isNumberClaimed(prize.number);
                  return (
                    <div 
                      key={prize.number}
                      className={`border ${claimed ? 'border-white/30 bg-white/5' : 'border-white/10'} rounded-lg p-3 text-center transition-all`}
                    >
                      <div className="flex justify-center">{prize.icon}</div>
                      <div className="text-white/40 text-xs mt-1">#{String(prize.number).padStart(2, '0')}</div>
                      <div className={`text-[10px] ${claimed ? 'text-white/70' : 'text-white/20'}`}>
                        {claimed ? prize.name : '❓ Belum'}
                      </div>
                      {claimed && (
                        <div className="text-green-400 text-[10px] mt-1">
                          <FaCheck className="inline mr-1" /> Dapat
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SURAT CINTA */}
      {isLetterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={() => setIsLetterOpen(false)}></div>
          
          <div className="relative z-10 max-w-md w-full bg-black border border-white/20 shadow-2xl animate-slideUp">
            <button onClick={() => setIsLetterOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white/70 z-20">
              <FaTimes size={18} />
            </button>
            
            <div className="border-b border-white/10 py-6 px-5">
              <div className="text-center">
                <div className="animate-bounce">
                  <GiSelfLove className="text-pink-400 text-3xl mx-auto mb-2" />
                </div>
                <h3 className="text-white/80 text-sm tracking-widest uppercase">Sepucuk Surat Cinta</h3>
                <p className="text-white/30 text-[10px] tracking-wide mt-1">Untuk Syafa</p>
              </div>
            </div>
            
            <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
              <div className="text-white/60 text-sm leading-relaxed space-y-4">
                <p className="text-white/40 text-xs">Nganjuk, 18 Juni 2026</p>
                
                <p>Hai, Sayang.</p>
                
                <p>Empat tahun. Rasanya tidak terasa secepat ini waktu berlalu.</p>
                
                <p>Terima kasih sudah menjadi bagian dari hidup mas selama ini. Terima kasih sudah bertahan, sudah sabar menghadapi sifat mas yang tidak mudah diatur, keras kepala, dan sering kali menyebalkan. Mas sadar, tidak selalu mudah berada di samping seseorang seperti mas.</p>
                
                <p>Terima kasih karena selalu ada. Di saat semuanya terasa ringan, maupun di saat mas sedang jatuh dan tidak bisa berpikir jernih. Adek adalah salah satu alasan mas bisa terus berdiri sampai sekarang.</p>
                
                <p>Maaf jika selama ini mas masih jauh dari kata cukup. Mas belum bisa menjadi yang terbaik untuk adek, tapi mas berusaha. Pelan-pelan.</p>
                
                <p>Semoga semua kenangan yang kita lalui menjadi cerita yang kelak akan kita kenang dengan hangat. Tanpa rasa sesal.</p>
                
                <p className="text-pink-400 pt-2 font-semibold">Terima kasih karena tetap memilih mas sampai hari ini. ❤️</p>
                
                <div className="pt-6 mt-4 border-t border-white/10">
                  <p className="text-white/40 text-xs">Hormat,</p>
                  <p className="text-white/70 text-sm mt-1 tracking-wide">Galvin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </footer>
  );
}

export default Footer;