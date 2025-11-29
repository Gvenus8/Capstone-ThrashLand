import React, { useRef, useState, useEffect } from 'react';
import { getUserArtById } from '../../fetches/UserFetches.jsx';
import { getMonsterById } from '../../fetches/MonsterFetch.jsx';
import { addToUserScore } from '../../fetches/scoreFetches.jsx';
import './mario.css';
import { scorePut } from '../../fetches/scorePost.jsx';
import { supabase } from '../../supabaseClient.jsx';

export const Play = () => {
    // Game container reference
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



   
    // ✅ ADD TIMER STATE

    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
    const [gameWon, setGameWon] = useState(false); // Track if time ran out (victory condition)


   
   
    // GAME AREA BOUNDARIES
    const GAME_BOUNDS = {
        left: 0,
        right: 800,
        top: -100,
        bottom: 500
    };

    
    
    // ADD ENEMIES STATE WITH SPAWN TIMERS
    const [enemies, setEnemies] = useState([]);
    const leftSpawnTimer = useRef(0);
    const rightSpawnTimer = useRef(0);

    
    
    // Player physics state
    const playerRef = useRef({
        x: 350,
        y: 350,
        velocityY: 0,
        speed: 6,
        jumpPower: 15,
        onGround: true
    });

    const [playerPosition, setPlayerPosition] = useState({ x: 350, y: 350 });

    
    
    // Add keyboard controls:
    const keysRef = useRef({});

    
    
    // ✅ RESTART GAME FUNCTION WITH TIMER RESET
    const restartGame = () => {
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        setShowBlackScreen(false);
        setGameOverReason('');
        setTimeLeft(60); // ✅ RESET TIMER
        setGameStarted(true);
        setEnemies([]);
        leftSpawnTimer.current = 0;
        rightSpawnTimer.current = 0;
        playerRef.current = {
            x: 350,
            y: 350,
            velocityY: 0,
            speed: 5,
            jumpPower: 15,
            onGround: true
        };
        setPlayerPosition({ x: 350, y: 350 });
    };
     const handleSaveScore = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        if (userId && typeof score === 'number') {
            scorePut(userId, score)
                .then(result => {
                    console.log("Score saved successfully:", result);
                })
                .catch(error => {
                    console.error("Failed to save score:", error);
                });
        }
    }


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
    }, [gameStarted, gameOver, gameWon, score]);

   
   
    // ✅ TIMER COUNTDOWN EFFECT
    useEffect(() => {
        if (!gameStarted || gameOver || gameWon) return;

        const timerInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // ✅ TIME'S UP - GAME WON!
                    setGameWon(true);
                    setGameStarted(false);
                    setShowBlackScreen(true);
                    setGameOverReason(`Time's up! You survived 60 seconds! 🎉`);



                    return 0;
                }
                return prev - 1;
            });
        }, 1000); // Update every second

        return () => clearInterval(timerInterval);
    }, [gameStarted, gameOver, gameWon, score]);

   
   
    // Fetch user's monster (keep existing code)
   useEffect(() => {
        const fetchUserMonster = async () => {
            try {
                setDebugInfo("Getting user from Supabase...");

                const { data: { user } } = await supabase.auth.getUser();
                console.log("User from Supabase:", user);
                setDebugInfo(`User found: ${user ? user.id : 'No user'}`);

                if (user?.id) {
                    setDebugInfo("Fetching user art...");
                    const userArt = await getUserArtById(user.id);
                    console.log("User art data:", userArt);
                    setDebugInfo(`Art found: ${userArt ? userArt.length : 0} items`);

                    if (userArt && userArt.length > 0) {
                        const latestArt = userArt[userArt.length - 1];
                        console.log("Latest art:", latestArt);

                        // ✅ CHANGE 3: Update to snake_case column names
                        const selectedColor = latestArt.fav_color_choice_id;
                        const selectedMusic = latestArt.fav_music_choice_id;
                        const selectedEmotion = latestArt.current_emotion_choice_id;
                        const selectedAdjective = latestArt.adjective_choice_id;

                        const monsterId = selectedColor + selectedMusic + selectedEmotion + selectedAdjective;

                        console.log("Monster ID calculated:", monsterId);

                        setDebugInfo("Fetching monster from database...");
                        const monsterArray = await getMonsterById(monsterId);
                        console.log("Monster array from database:", monsterArray);

                        if (monsterArray && monsterArray.length > 0) {
                            const monsterData = monsterArray[0];
                            console.log("Monster data:", monsterData);

                            setMonster({
                                url: monsterData.url,
                                title: latestArt.title || "Your Monster"
                            });
                            setDebugInfo(`Monster loaded: ${latestArt.title}`);
                        } else {
                            setDebugInfo("No monster found in database for this ID");
                        }
                    } else {
                        setDebugInfo("No art found - user hasn't created a monster yet");
                    }
                } else {
                    setDebugInfo("No user logged in");
                }
            } catch (error) {
                console.error("Error fetching monster:", error);
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
   
   
    // ✅ AUTOMATIC MUSIC CONTROL EFFECT
    useEffect(() => {
        if (gameStarted && !gameOver && !gameWon && !showBlackScreen) {
            // Start music when game begins
            if (audioRef.current) {
                audioRef.current.currentTime = 0; // Start from beginning
                audioRef.current.play().catch(error => {
                    console.log("Audio play failed:", error);
                });
            }
        } else {
            // Stop music when game ends or is paused
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }

      
      
        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [gameStarted, gameOver, gameWon, showBlackScreen]);

    
    
    // ✅ GAME LOOP WITH TIMER-BASED LOGIC
    useEffect(() => {
        if (!gameStarted || gameOver || gameWon) return;

        let animationId;

        const gameLoop = () => {
            const player = playerRef.current;
            const keys = keysRef.current;

           
            // Handle movement input
            if (keys.ArrowLeft || keys.KeyA) {
                player.x -= player.speed;
            }
            if (keys.ArrowRight || keys.KeyD) {
                player.x += player.speed;
            }
            if ((keys.ArrowUp || keys.Space || keys.KeyW) && player.onGround) {
                player.velocityY = -player.jumpPower;
                player.onGround = false;
            }

           
            // Apply gravity
            player.velocityY += 0.8;
            player.y += player.velocityY;

           
            // Ground collision
            const groundY = 350;
            if (player.y >= groundY) {
                player.y = groundY;
                player.velocityY = 0;
                player.onGround = true;
            }

           
            // ✅ MODIFIED BOUNDARY CHECKING - ONLY SOME BOUNDARIES END GAME
            let gameOverTriggered = false;
            let reason = '';

            
            // Falling off bottom ends the game
            if (player.y > GAME_BOUNDS.bottom) {
                gameOverTriggered = true;
                reason = 'Fell off the map! 🕳️';
            }

           
            // ✅ ADD SIDE WALL GAME OVER CONDITIONS
            // Left wall game over
            if (player.x < GAME_BOUNDS.left) {
                gameOverTriggered = true;
                reason = 'Hit the left wall! ⬅️💥';
            }

            // Right wall game over
            if (player.x > GAME_BOUNDS.right - 80) { // -80 for player width
                gameOverTriggered = true;
                reason = 'Hit the right wall! ➡️💥';
            }

            if (gameOverTriggered) {
                setGameOver(true);
                setGameStarted(false);
                setShowBlackScreen(true);
                setGameOverReason(reason);
                return;
            }

            
            
            // ✅ DYNAMIC ENEMY SPAWNING - FASTER AS TIME PROGRESSES
            const timeElapsed = 60 - timeLeft;
            const spawnRate = Math.max(60, 150 - timeElapsed * 2); // Spawn faster over time

           
           
            // Spawn enemies from the RIGHT side
            rightSpawnTimer.current += 1;
            if (rightSpawnTimer.current >= spawnRate) {
                setEnemies(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    x: 570,
                    y: 350,
                    width: 40,
                    height: 40,
                    speed: 2 + Math.floor(timeElapsed / 15), // ✅ ENEMIES GET FASTER OVER TIME
                    velocityX: -(2 + Math.floor(timeElapsed / 15)),
                    velocityY: 0,
                    bouncing: false,
                    bounceTimer: 0,
                    alive: true,
                    spawnSide: 'right'
                }]);
                rightSpawnTimer.current = 0;
            }

           
           
            // Spawn enemies from the LEFT side
            leftSpawnTimer.current += 1;
            if (leftSpawnTimer.current >= spawnRate + 30) {
                setEnemies(prev => [...prev, {
                    id: Date.now() + Math.random() + 1000,
                    x: -40,
                    y: 350,
                    width: 40,
                    height: 40,
                    speed: 2 + Math.floor(timeElapsed / 15), // ✅ ENEMIES GET FASTER OVER TIME
                    velocityX: 2 + Math.floor(timeElapsed / 15),
                    velocityY: 0,
                    bouncing: false,
                    bounceTimer: 0,
                    alive: true,
                    spawnSide: 'left'
                }]);
                leftSpawnTimer.current = 0;
            }

           
           
            // UPDATE ENEMIES WITH PHYSICS
            setEnemies(prev => prev
                .map(enemy => {
                    let newEnemy = { ...enemy };

                    newEnemy.x += newEnemy.velocityX;
                    newEnemy.y += newEnemy.velocityY;

                    if (newEnemy.bouncing) {
                        newEnemy.velocityY += 0.5;
                        newEnemy.bounceTimer -= 1;

                        if (newEnemy.y >= 350) {
                            newEnemy.y = 350;
                            newEnemy.velocityY = 0;

                            if (newEnemy.bounceTimer <= 0) {
                                newEnemy.bouncing = false;
                                newEnemy.velocityX = newEnemy.spawnSide === 'right'
                                    ? -(2 + Math.floor(timeElapsed / 15))
                                    : (2 + Math.floor(timeElapsed / 15));
                            }
                        }
                    }

                    return newEnemy;
                })
                .filter(enemy => enemy.x > -80 && enemy.x < 880 && enemy.alive)
            );

            
            
            // COLLISION DETECTION WITH BOUNCING
            setEnemies(prev => prev.map(enemy => {
                if (!enemy.alive || enemy.bouncing) return enemy;

                if (player.x < enemy.x + enemy.width &&
                    player.x + 80 > enemy.x &&
                    player.y < enemy.y + enemy.height &&
                    player.y + 80 > enemy.y) {

                    if (player.velocityY > 0 && player.y < enemy.y - 10) {
                        // PLAYER JUMPED ON ENEMY - KILL IT
                        player.velocityY = -8;
                        // ✅ BONUS POINTS FOR FASTER ENEMIES
                        const pointBonus = Math.floor(timeElapsed / 10);
                        setScore(prevScore => prevScore + (10 + pointBonus));
                        return { ...enemy, alive: false };
                    } else {
                        // SIDE COLLISION - MAKE ENEMY BOUNCE
                        const playerCenterX = player.x + 20;
                        const enemyCenterX = enemy.x + 20;

                        const bounceDirection = playerCenterX > enemyCenterX ? -1 : 1;

                        if (playerCenterX > enemyCenterX) {
                            player.x += 25;
                        } else {
                            player.x -= 25;
                        }

                        return {
                            ...enemy,
                            bouncing: true,
                            bounceTimer: 60,
                            velocityX: bounceDirection * 5,
                            velocityY: -8,
                        };
                    }
                }
                return enemy;
            }));

           
           
            // Update React state
            setPlayerPosition({ x: player.x, y: player.y });

            if (!gameOver && !gameWon) {
                animationId = requestAnimationFrame(gameLoop);
            }
        };

        gameLoop();

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [gameStarted, gameOver, gameWon, timeLeft]);

   
   
   
    return (
        <div className="play-container">
            <div className='play-header'>

                <div className="monster-jump-wrapper">
                    <div className='pit'> PIT MASTER </div>
                    {/* <audio
                        ref={audioRef}
                        loop={true}                    // ✅ LOOP THE MUSIC
                        volume={0.3}                   // ✅ SET VOLUME (0.0 to 1.0)
                        preload="auto"                 // ✅ PRELOAD THE AUDIO
                    >
                        <source src="/audio/game-music.mp3" type="audio/mpeg" />

                        Your browser does not support the audio element.
                    </audio>*/}
                    <div className="game-container2" ref={gameRef} style={{ position: 'relative' }}>
                        {showBlackScreen && (
                            <div className='black-screen' style={{
                                position: 'absolute',
                                top: '0%',                    // ✅ ALIGN TO CONTAINER TOP
                                left: '0%',                   // ✅ ALIGN TO CONTAINER LEFT
                                width: '790px',            // ✅ MATCH .game-container width exactly
                                height: '490px',
                                backgroundColor: 'black',
                                backgroundImage: 'url(/images/pmThumb.png)',
                                backgroundSize: '741px 485px',           // ✅ CHANGE TO 'cover' TO FILL ENTIRE AREA
                                backgroundPosition: 'center center', // ✅ CENTER THE IMAGE
                                backgroundRepeat: 'no-repeat',
                                border: '5px, solid #ff3131',
                                borderRadius: '10px',
                                zIndex: 9999,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                // ✅ NO BORDER (container already has one)
                                margin: 0,               // ✅ NO MARGIN
                                padding: 0,
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    {/* ✅ SHOW DIFFERENT CONTENT BASED ON GAME STATE */}
                                    {!gameStarted && !gameOver && !gameWon ? (
                                        // Start screen
                                        <>

                                        </>
                                    ) : (
                                        // Game over screen
                                        <>

                                            <div style=
                                                {{
                                                    fontSize: '68px',
                                                    fontFamily: "Bitcount Prop Double",
                                                    marginBottom: '10px',
                                                    animation: 'infinite 8s lc3',
                                                    border: '5px solid #ff3131',
                                                    borderRadius: '20px',
                                                    width: '100%',
                                                    height: '250px',
                                                    backgroundColor: 'black',
                                                }}>
                                                Final Score: {score}
                                                <div className="save-btn6">
                                                    <button onClick={handleSaveScore}>
                                                        Save Score
                                                    </button>
                                                </div>
                                            </div>


                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="game-container" id="flashbox">
                            <div className="game-flash"></div>
                            <div className="game-world">
                               
                    
                    {/* MONSTER CHARACTER */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: playerPosition.x + 'px',
                                        top: playerPosition.y + 'px',
                                        width: '80px',
                                        height: '80px',
                                        backgroundImage: monster ? `url(${monster.url})` : 'none',
                                        backgroundColor: monster ? 'transparent' : '#FF0000',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',

                                        zIndex: 999,
                                        transition: 'left 0.1s ease-out',
                                        opacity: gameOver ? 0.5 : 1
                                    }}
                                >
                                </div>

                                {/* ✅ RENDER ENEMIES WITH ENEMY.PNG IMAGE */}
                                {enemies.filter(enemy => enemy.alive).map(enemy => (
                                    <div
                                        key={enemy.id}
                                        style={{
                                            position: 'absolute',
                                            left: enemy.x + 'px',
                                            top: enemy.y + 'px',
                                            width: enemy.width + 50 + 'px',
                                            height: enemy.height + 50 + 'px',
                                            // ✅ USE YOUR ENEMY.PNG IMAGE
                                            backgroundImage: 'url(/images/enemy.png)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            // ✅ KEEP BORDER FOR BOUNCE EFFECTS

                                            zIndex: 10,
                                            transform: enemy.bouncing ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.1s ease'
                                        }}
                                    >
                                      
                                        {/* ✅ OPTIONAL: KEEP EXPLOSION EFFECT FOR BOUNCING */}
                                        {enemy.bouncing && (
                                            <div style={{
                                                color: 'yellow',
                                                fontSize: '20px',
                                                textAlign: 'center',
                                                lineHeight: '36px',
                                                textShadow: '2px 2px 4px red'
                                            }}>
                                                💥
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="ground"></div>
                            </div>
                        </div>




                        <div className="game-header">
                            {/* ✅ TIMER AND SCORE DISPLAY */}
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
                                <div style={{ color: timeLeft <= 300 ? 'copper' : timeLeft <= 600 ? 'silver' : timeLeft <= 800 ? 'gold' : '#ff3131', }}>
                                    Score: {score}
                                </div>
                                <div style={{ color: '#ff3131', fontSize: "15px", fontFamily: "Bitcount Prop Double", }}>
                                    Controls &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    Move: arrow keys &nbsp;&nbsp;&nbsp;&nbsp; Jump: Spacebar
                                </div>
                            </div>
                            <div className="game-buttons" >

                              
                              
                                {/* ✅ IMPROVED BUTTON CONTROLS */}
                                {!gameStarted && !gameOver && !gameWon && (
                                    <button onClick={() => {
                                        setGameStarted(true)
                                        setShowBlackScreen(false)
                                    }} style={{
                                        backgroundImage: 'url(/images/startbutton.png)',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        //padding: '15px 30px',
                                        fontweight: 'bold',

                                        textshadow: '1px 1px 1px rgba(0,0,0,0.8)',
                                        fontfamily: "Bitcount Prop Double",

                                        width: '120px',
                                        height: '105px',

                                        border: '5px solid #ff3131',
                                    }}>
                                        <div className="starttext">

                                            Start
                                        </div>
                                    </button>
                                )}

                                {gameStarted && !gameOver && !gameWon && (
                                    <button onClick={() => setGameStarted(false)} style={{
                                        backgroundImage: 'url(/images/startbutton.png)',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        //padding: '15px 30px',
                                        fontweight: 'bold',

                                        textshadow: '1px 1px 1px rgba(0,0,0,0.8)',
                                        fontfamily: "Bitcount Prop Double",

                                        width: '120px',
                                        height: '105px',

                                        border: '5px solid #ff3131'
                                    }}>
                                        <div className="starttext">

                                            Pause
                                        </div>
                                    </button>
                                )}

                                {(gameOver || gameWon) && (
                                    <div style={{
                                        margin: '0px 0',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        width: '260px',
                                    }}>


                                        <button className="game-buttons"
                                            onClick={restartGame} style={{
                                                backgroundImage: 'url(/images/startbutton.png)',
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundColor: 'transparent',
                                                color: 'white',
                                                //padding: '15px 30px',
                                                fontWeight: 'bold',
                                                width: '120px',
                                                height: '105px',
                                                position: 'absolute',
                                                top: '20px',
                                                left: '160px',
                                            }}>
                                            <div className="starttext2">

                                                Play
                                            </div>
                                        </button>
                                        <button style={{
                                            backgroundImage: 'url(/images/startbutton.png)',
                                            backgroundSize: 'contain',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundColor: 'transparent',
                                            color: 'white',
                                            //padding: '15px 30px',
                                            fontWeight: 'bold',
                                            width: '120px',
                                            height: '105px',
                                            left: '390px',
                                            top: '170px',
                                            position: 'absolute',
                                        }}
                                            onClick={() => {
                                                setGameOver(false);
                                                setGameWon(false);
                                                setGameStarted(false);
                                                setShowBlackScreen(true);
                                                setGameOverReason('');
                                            }}>
                                            <div className="starttext2">

                                                Menu
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="game-controls">
                            <p><strong>🎮 Controls:</strong></p>
                            <p>A/D or ← → : Move left/right</p>
                            <p>W/Space/↑ : Jump</p>
                            <p><strong>🏆 Goal:</strong> Survive 60 seconds and get the highest score!</p>
                            <p><strong>⚡ Challenge:</strong> Enemies get faster and more frequent over time!</p>
                            <p><strong>💰 Bonus:</strong> Later enemies give more points!</p>
                        </div>
                        {/* DEBUG SECTION */}
                        <div className="debug-info" style={{
                            background: gameStarted ? 'lightgreen' : gameOver ? 'red' : gameWon ? 'gold' : 'yellow',


                        }}>

                            S: {debugInfo} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            GS: {gameStarted ? 'Y' : 'N'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            GO: {gameOver ? 'Y' : 'N'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            GW: {gameWon ? 'Y' : 'N'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            M: {monster ? 'F' : 'NF'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                            TE: {60 - timeLeft}s,&nbsp;&nbsp;&nbsp;
                            Bonus: +{Math.floor((60 - timeLeft) / 15)}&nbsp;&nbsp;&nbsp;

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};