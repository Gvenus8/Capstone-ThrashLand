import React, { useRef, useState, useEffect } from 'react';
import { getUserArtById } from '../../fetches/UserFetches.jsx';
import { getMonsterById } from '../../fetches/MonsterFetch.jsx';
import './mario.css';
import { scorePut } from '../../fetches/scorePost.jsx';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';


export const Play = () => {
    const gameRef = useRef(null);
    const audioRef = useRef(null);
    
    // Basic game state
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverReason, setGameOverReason] = useState('');
    const [monster, setMonster] = useState(null);
    const [isLoadingMonster, setIsLoadingMonster] = useState(true);
    const [debugInfo, setDebugInfo] = useState("Starting...");
    const [showBlackScreen, setShowBlackScreen] = useState(true);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameWon, setGameWon] = useState(false);
    const [screenShake, setScreenShake] = useState(0); // ✅ NEW: Visual feedback
    const [isMobile, setIsMobile] = useState(false);
   
    const navigate = useNavigate();
   
    // GAME CONSTANTS
    const GAME_BOUNDS = {
        left: 0,
        right: 800,
        top: -100,
        bottom: 500
    };
    
    const PLAYER_SIZE = 80;
    const ENEMY_SIZE = 80; // ✅ FIX 1: Consistent size
    
    // Enemy spawning
    const [enemies, setEnemies] = useState([]);
    const frameCount = useRef(0);
    const lastLeftSpawn = useRef(0);
    const lastRightSpawn = useRef(0);
    
    // Player physics state
    const playerRef = useRef({
        x: 350,
        y: 350,
        velocityY: 0,
        velocityX: 0, // ✅ NEW: Horizontal velocity for smooth pushing
        speed: 6,
        jumpPower: 18,
        onGround: true
    });

    const [playerPosition, setPlayerPosition] = useState({ x: 350, y: 350 });
    const keysRef = useRef({});

    // ✅ HELPER FUNCTIONS
    const getTimeElapsed = () => 60 - timeLeft;
    
    const getEnemySpeed = () => {
        const elapsed = getTimeElapsed();
        return 2 + Math.floor(elapsed / 15);
    };
    
    const getSpawnInterval = () => {
        const elapsed = getTimeElapsed();
        return Math.max(50, 120 - elapsed * 2); // ✅ Spawns faster and more frequently
    };
    
    const createEnemy = (side) => {
        const speed = getEnemySpeed();
        const isRight = side === 'right';
        
        return {
            id: Date.now() + Math.random() + (isRight ? 0 : 1000),
            x: isRight ? GAME_BOUNDS.right - ENEMY_SIZE : GAME_BOUNDS.left,// ✅ FIX 4: Spawn at actual edges
            y: 350,
            width: ENEMY_SIZE,
            height: ENEMY_SIZE,
            speed: speed,
            velocityX: isRight ? -speed : speed,
            velocityY: 0,
            bouncing: false,
            bounceTimer: 0,
            alive: true,
            spawnSide: side
        };
    };
    
    const restartGame = () => {
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        setShowBlackScreen(false);
        setGameOverReason('');
        setTimeLeft(60);
        setGameStarted(true);
        setEnemies([]);
        setScreenShake(0);
        frameCount.current = 0;
        lastLeftSpawn.current = 0;
        lastRightSpawn.current = 0;
        playerRef.current = {
            x: 350,
            y: 350,
            velocityY: 0,
            velocityX: 0,
            speed: 6,
            jumpPower: 18,
            onGround: true
        };
        setPlayerPosition({ x: 350, y: 350 });
    };
    
    const handleSaveScore = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        if (userId && typeof score === 'number') {
            scorePut(userId, score)
                .then(result => console.log("Score saved successfully:", result))
                .catch(error => console.error("Failed to save score:", error));
        }
    };
    useEffect(() => {
    const checkMobile = () => {
        const isMobileDevice = window.innerWidth < 768 || 'ontouchstart' in window;
        setIsMobile(isMobileDevice);
    };
    
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
}, []);
    const handleTouchButton = (key, isPressed) => {
    keysRef.current[key] = isPressed;
};
    // Timer countdown
    useEffect(() => {
        if (!gameStarted || gameOver || gameWon) return;

        const timerInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameWon(true);
                    setGameStarted(false);
                    setShowBlackScreen(true);
                    setGameOverReason(`Time's up! You survived 60 seconds! 🎉`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [gameStarted, gameOver, gameWon]);

    // Fetch monster
    useEffect(() => {
        const fetchUserMonster = async () => {
            try {
                setDebugInfo("Getting user from Supabase...");
                const { data: { user } } = await supabase.auth.getUser();
                setDebugInfo(`User found: ${user ? user.id : 'No user'}`);

                if (user?.id) {
                    setDebugInfo("Fetching user art...");
                    const userArt = await getUserArtById(user.id);
                    setDebugInfo(`Art found: ${userArt ? userArt.length : 0} items`);

                    if (userArt && userArt.length > 0) {
                        const latestArt = userArt[userArt.length - 1];
                        const monsterId = 
                            latestArt.fav_color_choice_id + 
                            latestArt.fav_music_choice_id + 
                            latestArt.current_emotion_choice_id + 
                            latestArt.adjective_choice_id;

                        setDebugInfo("Fetching monster from database...");
                        const monsterArray = await getMonsterById(monsterId);

                        if (monsterArray && monsterArray.length > 0) {
                            setMonster({
                                url: monsterArray[0].url,
                                title: latestArt.title || "Your Monster"
                            });
                            setDebugInfo(`Monster loaded: ${latestArt.title}`);
                        } else {
                            setDebugInfo("No monster found");
                        }
                    } else {
                        setDebugInfo("No art found");
                    }
                }
            } catch (error) {
                setDebugInfo(`Error: ${error.message}`);
            } finally {
                setIsLoadingMonster(false);
            }
        };

        fetchUserMonster();
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.code] = true;
            e.preventDefault();
        };
        const handleKeyUp = (e) => {
            keysRef.current[e.code] = false;
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
   
    // Music control
useEffect(() => {
    if (gameStarted && !gameOver && !gameWon && !showBlackScreen) {
        if (audioRef.current) {
            audioRef.current.volume = 0.5; // ✅ Set volume (0.0 to 1.0)
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => {
                console.log("Audio play failed:", error);
            });
        }
    } else {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }

    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };
}, [gameStarted, gameOver, gameWon, showBlackScreen]);

    // ✅✅✅ IMPROVED GAME LOOP ✅✅✅
    useEffect(() => {
        if (!gameStarted || gameOver || gameWon) return;

        let animationId;

        const gameLoop = () => {
            const player = playerRef.current;
            const keys = keysRef.current;

            frameCount.current++;

            // ✅ FIX 3: Smooth horizontal movement with friction
            if (keys.ArrowLeft || keys.KeyA) {
                player.velocityX -= 1.2;
            }
            if (keys.ArrowRight || keys.KeyD) {
                player.velocityX += 1.2;
            }
            
            // Apply friction to horizontal movement
            player.velocityX *= 0.85;
            
            // Clamp max speed
            const maxSpeed = 8;
            if (player.velocityX > maxSpeed) player.velocityX = maxSpeed;
            if (player.velocityX < -maxSpeed) player.velocityX = -maxSpeed;
            
            // Apply horizontal velocity
            player.x += player.velocityX;

            // Jump
            if ((keys.ArrowUp || keys.Space || keys.KeyW) && player.onGround) {
                player.velocityY = -player.jumpPower;
                player.onGround = false;
            }

            // Gravity
            player.velocityY += 0.8;
            player.y += player.velocityY;

            // Ground collision
            const groundY = 350;
            if (player.y >= groundY) {
                player.y = groundY;
                player.velocityY = 0;
                player.onGround = true;
            }

            // ✅ Screen shake decay
            if (screenShake > 0) {
                setScreenShake(prev => prev * 0.9);
            }

            // Boundary checking
            let gameOverTriggered = false;
            let reason = '';

            if (player.y > GAME_BOUNDS.bottom) {
                gameOverTriggered = true;
                reason = 'Fell off the map! 🕳️';
            }
            if (player.x < GAME_BOUNDS.left) {
                gameOverTriggered = true;
                reason = 'Bummer, you left the pit! ';
            }
            if (player.x > GAME_BOUNDS.right - PLAYER_SIZE) {
                gameOverTriggered = true;
                reason = 'bummer, you left the pit! ➡️💥';
            }

            if (gameOverTriggered) {
                setGameOver(true);
                setGameStarted(false);
                setShowBlackScreen(true);
                setGameOverReason(reason);
                return;
            }

            // ✅ ENEMY SPAWNING
            const spawnInterval = getSpawnInterval();

            if (frameCount.current - lastRightSpawn.current >= spawnInterval) {
                setEnemies(prev => [...prev, createEnemy('right')]);
                lastRightSpawn.current = frameCount.current;
            }

            if (frameCount.current - lastLeftSpawn.current >= spawnInterval + 15) {
                setEnemies(prev => [...prev, createEnemy('left')]);
                lastLeftSpawn.current = frameCount.current;
            }

            // ✅ FIX 5: ENEMY HERDING BEHAVIOR
            setEnemies(prev => prev
                .map(enemy => {
                    if (!enemy.alive) return enemy;

                    let updated = { ...enemy };

                   // 🔥 ENEMIES JUMP RANDOMLY (Mosh pit chaos!)
                if (!updated.jumping && updated.y >= 350 && Math.random() < 0.015) { // 1.5% chance per frame
                    updated.velocityY = -10 - Math.random() * 5; // Random jump height
                    updated.jumping = true;
                }

                // Apply herding toward player
                const distanceToPlayer = Math.abs(player.x - updated.x);
                if (distanceToPlayer < 300 && !updated.bouncing) {
                    const pullTowardPlayer = (player.x > updated.x ? 0.4 : -0.4); // ✅ Stronger pull
                    updated.velocityX += pullTowardPlayer;
                }

                // Apply movement
                updated.x += updated.velocityX;
                updated.y += updated.velocityY;

                // 🔥 ENEMY GRAVITY AND LANDING
                if (updated.jumping || updated.y < 350) {
                    updated.velocityY += 0.8; // Gravity
                }

                if (updated.y >= 350 && updated.jumping) {
                    updated.y = 350;
                    updated.velocityY = 0;
                    updated.jumping = false;
                }

                // Bouncing physics (when hit by player)
                if (updated.bouncing) {
                    updated.velocityY += 0.5;
                    updated.bounceTimer -= 1;

                    if (updated.y >= 350) {
                        updated.y = 350;
                        updated.velocityY = 0;

                        if (updated.bounceTimer <= 0) {
                            updated.bouncing = false;
                            const speed = getEnemySpeed();
                            updated.velocityX = updated.spawnSide === 'right' ? -speed : speed;
                        }
                    }
                }

                return updated;
            })
            .filter(enemy => enemy.x > -100 && enemy.x < 900) // ✅ Keep ALL enemies (don't filter by alive)
        );

            // ✅ FIX 2: IMPROVED COLLISION DETECTION
            setEnemies(prev => prev.map(enemy => {
                if (!enemy.alive || enemy.bouncing) return enemy;

                // Check collision with tight hitboxes
                const playerBox = {
                    left: player.x + 15,    // ✅ Tighter hitbox
                    right: player.x + PLAYER_SIZE - 15,
                    top: player.y + 10,
                    bottom: player.y + PLAYER_SIZE
                };
                
                const enemyBox = {
                    left: enemy.x + 5,
                    right: enemy.x + enemy.width - 5,
                    top: enemy.y + 5,
                    bottom: enemy.y + enemy.height
                };

                const collision = (
                    playerBox.left < enemyBox.right &&
                    playerBox.right > enemyBox.left &&
                    playerBox.top < enemyBox.bottom &&
                    playerBox.bottom > enemyBox.top
                );

                if (collision) {
                    // ✅ FIX 2: Better jump kill detection
                    const playerFeetY = player.y + PLAYER_SIZE;
                    const enemyTopY = enemy.y;
                    const isJumpKill = (
                        player.velocityY > 3 &&           // Must be falling with speed
                        playerFeetY < enemy.y + 25 &&     // Feet above enemy center
                        player.y < enemy.y                // Player higher overall
                    );

                     if (isJumpKill) {
                    // 🔥 JUMP KILL - Big reward!
                    player.velocityY = -12;
                    const pointBonus = Math.floor(getTimeElapsed() / 10);
                    const basePoints = 15;
                    const comboMultiplier = 1.5;
                    const totalPoints = Math.floor((basePoints + pointBonus) * comboMultiplier);
                    
                    setScore(prevScore => prevScore + totalPoints);
                    setScreenShake(8);
                    
                    return { ...enemy, alive: false };
                     }
                    // Side collision - smooth push
                    else {
                        const playerCenterX = player.x + (PLAYER_SIZE / 2);
                        const enemyCenterX = enemy.x + (enemy.width / 2);
                        const pushDirection = playerCenterX > enemyCenterX ? 1 : -1;

                        // ✅ FIX 3: Smooth push instead of teleport
                        const pushStrength = 100;
                        player.velocityX += pushDirection * pushStrength;
                       // player.velocityY = -5;
                        setScore(prevScore => Math.max(0, prevScore - 1));

                        // ✅ FIX 5: Visual feedback
                        setScreenShake(8);

                        return {
                            ...enemy,
                            bouncing: true,
                            bounceTimer: 15,
                            velocityX: -pushDirection * 4,
                            velocityY: -3,
                        };
                    }
                }
                return enemy;
            }));

            setPlayerPosition({ x: player.x, y: player.y });

            if (!gameOver && !gameWon) {
                animationId = requestAnimationFrame(gameLoop);
            }
        };

        gameLoop();
        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [gameStarted, gameOver, gameWon, timeLeft]);

    // ✅ JSX WITH VISUAL IMPROVEMENTS
    return (
        <div className="play-container">
             <audio 
            ref={audioRef} 
            src="/audio/game-music.mp3" 
            loop 
            preload="auto"
        />
        
            <div className='play-header'>
                <div className="monster-jump-wrapper">
                    <div className='pit'> PIT MASTER </div>
                    <div className="game-container2" ref={gameRef} style={{ 
                        position: 'relative',
                        transform: `translate(${Math.random() * screenShake - screenShake/2}px, ${Math.random() * screenShake - screenShake/2}px)` // ✅ Screen shake
                    }}>
                        {showBlackScreen && (
                            <div className='black-screen' style={{
                                position: 'absolute',
                                top: '0%',
                                left: '0%',
                                width: '790px',
                                height: '490px',
                                backgroundColor: 'black',
                                backgroundImage: 'url(/images/pmThumb.png)',
                                backgroundSize: '741px 485px',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                                border: '5px solid #ff3131',
                                borderRadius: '10px',
                                zIndex: 9999,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    {(gameOver || gameWon) && (
                                        <div style={{
                                            fontSize: '68px',
                                            fontFamily: "Bitcount Prop Double",
                                            border: '5px solid #ff3131',
                                            borderRadius: '20px',
                                            width: '100%',
                                            height: '250px',
                                            backgroundColor: 'black',
                                            color: 'white',
                                            padding: '20px'
                                        }}>
                                            Final Score: {score}
                                            <div className="save-btn6">
                                                <button onClick={handleSaveScore}>
                                                    Save Score
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="game-container" id="flashbox">
                            <div className="game-flash"></div>
                            <div className="game-world">
                                {/* Player */}
                                <div style={{
                                    position: 'absolute',
                                    left: playerPosition.x + 'px',
                                    top: playerPosition.y + 'px',
                                    width: PLAYER_SIZE + 'px',
                                    height: PLAYER_SIZE + 'px',
                                    backgroundImage: monster ? `url(${monster.url})` : 'none',
                                    backgroundColor: monster ? 'transparent' : '#FF0000',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    zIndex: 999,
                                    opacity: gameOver ? 0.5 : 1,
                                    overflow: 'hidden',
                                    // ✅ Debugging hitbox (remove in production)
                                    // border: '2px solid lime'
                                }} />

                                {/* Enemies - ✅ FIX 1: Match visual and collision size */}
                                {enemies.filter(enemy => enemy.alive).map(enemy => (
                                    <div
                                        key={enemy.id}
                                        style={{
                                            position: 'absolute',
                                            left: enemy.x + 'px',
                                            top: enemy.y + 'px',
                                            width: enemy.width + 'px',  // ✅ NO +50
                                            height: enemy.height + 'px', // ✅ NO +50
                                            backgroundImage: 'url(/images/enemy.png)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            zIndex: 10,
                                            transform: enemy.bouncing ? 'scale(1.2) rotate(15deg)' : 'scale(1)',
                                            transition: 'transform 0.1s ease',
                                            // ✅ Debugging hitbox (remove in production)
                                            // border: '2px solid red'
                                        }}
                                    >
                                        {enemy.bouncing && (
                                            <div style={{
                                                color: 'yellow',
                                                fontSize: '24px',
                                                textAlign: 'center',
                                                textShadow: '2px 2px 4px red'
                                            }}>💥</div>
                                        )}
                                    </div>
                                ))}

                                <div className="ground"></div>
                            </div>
                        </div>

                        <div className="game-header">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                                alignItems: 'baseline',
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}>
                                <div style={{
                                    color: timeLeft <= 10 ? 'red' : timeLeft <= 30 ? 'orange' : 'yellow',
                                }}>
                                    Time: {timeLeft}s
                                </div>
                                <div style={{ color: '#ff3131' }}>
                                    Score: {score}
                                </div>
                                <div style={{ color: '#ff3131', fontSize: "15px", fontFamily: "Bitcount Prop Double" }}>
                                    Controls: Arrow keys + Spacebar
                                </div>
                            </div>
                            
                            <div className="game-buttons">
                                {!gameStarted && !gameOver && !gameWon && (
                                    <button onClick={() => {
                                        setGameStarted(true);
                                        setShowBlackScreen(false);
                                    }} style={{
                                        backgroundImage: 'url(/images/startbutton.png)',
                                        backgroundSize: 'cover',
                                        backgroundColor: 'transparent',
                                        width: '120px',
                                        height: '105px',
                                        border: '5px solid #ff3131',
                                    }}>
                                        <div className="starttext">Start</div>
                                    </button>
                                )}

                                {gameStarted && !gameOver && !gameWon && (
                                    <button onClick={() => setGameStarted(false)} style={{
                                        backgroundImage: 'url(/images/startbutton.png)',
                                        backgroundSize: 'cover',
                                        backgroundColor: 'transparent',
                                        width: '120px',
                                        height: '105px',
                                        border: '5px solid #ff3131'
                                    }}>
                                        <div className="starttext">Pause</div>
                                    </button>
                                )}

                                {(gameOver || gameWon) && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        width: '260px',
                                    }}>
                                        <button onClick={restartGame} style={{
                                            backgroundImage: 'url(/images/startbutton.png)',
                                            backgroundSize: 'contain',
                                            backgroundColor: 'transparent',
                                            width: '120px',
                                            height: '105px',
                                            position: 'absolute',
                                            top: '170px',
                                            left: '300px',
                                        }}>
                                            <div className="starttext2">Play</div>
                                        </button>
                                        <button onClick={() => navigate ('/arcade')}
                                         style={{
                                            backgroundImage: 'url(/images/startbutton.png)',
                                            backgroundSize: 'contain',
                                            backgroundColor: 'transparent',
                                            width: '120px',
                                            height: '105px',
                                            left: '390px',
                                            top: '170px',
                                            position: 'absolute',
                                        }}>
                                            <div className="starttext2">Menu</div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                       
                        
                        <div className="debug-info" style={{
                            background: gameStarted ? 'lightgreen' : gameOver ? 'red' : gameWon ? 'gold' : 'yellow',
                        }}>
                            Enemies: {enemies.filter(e => e.alive).length} | 
                            Time: {timeLeft}s | 
                            Speed: {getEnemySpeed()}x | 
                            Score: {score}
                        </div>
                    </div>
                </div>
            </div>
         {isMobile && (
                <div style={{
                    position: 'fixed',
                    bottom: '120px',
                    left: '0',
                    right: '0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    zIndex: 10000,
                    pointerEvents: gameStarted && !gameOver && !gameWon ? 'auto' : 'none',
                    opacity: gameStarted && !gameOver && !gameWon ? 1 : 0.3
                }}>
                    {/* Left side - Movement buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onTouchStart={() => handleTouchButton('ArrowLeft', true)}
                            onTouchEnd={() => handleTouchButton('ArrowLeft', false)}
                            style={{
                                width: '300px',
                                height: '200px',
                                fontSize: '102px',
                                textAlign: 'center',
                                backgroundColor: 'rgba(255, 49, 49, 0.8)',
                                border: '3px solid #fff',
                                borderRadius: '15px',
                                color: 'white',
                                fontWeight: 'bold',
                                touchAction: 'none',
                                userSelect: 'none',
                                WebkitTapHighlightColor: 'transparent',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                marginLeft: '15px'
                            }}
                        >
                            ←
                        </button>
                        
                        <button
                            onTouchStart={() => handleTouchButton('ArrowRight', true)}
                            onTouchEnd={() => handleTouchButton('ArrowRight', false)}
                            style={{
                                width: '300px',
                                height: '200px',
                                fontSize: '102px',
                                textAlign: 'center',
                                backgroundColor: 'rgba(255, 49, 49, 0.8)',
                                border: '3px solid #fff',
                                borderRadius: '15px',
                                color: 'white',
                                fontWeight: 'bold',
                                touchAction: 'none',
                                userSelect: 'none',
                                WebkitTapHighlightColor: 'transparent',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            →
                        </button>
                    </div>

                    {/* Right side - Jump button */}
                    <button
                        onTouchStart={() => handleTouchButton('Space', true)}
                        onTouchEnd={() => handleTouchButton('Space', false)}
                        style={{
                            width: '300px',
                            height: '200px',
                            fontSize: '88px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255, 215, 0, 0.9)',
                            border: '3px solid #fff',
                            borderRadius: '15px',
                            color: 'white',
                            fontWeight: 'bold',
                            touchAction: 'none',
                            userSelect: 'none',
                            WebkitTapHighlightColor: 'transparent',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            marginRight: '160px'
                        }}
                    >
                       ↑
                    </button>
                </div>
            )}
        </div>
    );
};