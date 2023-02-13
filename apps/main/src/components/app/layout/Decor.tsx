import React from 'react';
import styles from "./Decor.module.css";

const Decor: React.FC = () => {
    const skyRef = React.useRef<HTMLDivElement>(null);
    const starRef = React.useRef<HTMLDivElement>(null);

    const updateSkyColor = React.useCallback(() => {
        // Get the current time
        const currentTime = new Date().getHours();

        // Set the sky color based on the current time
        let gradient: string;
        if (currentTime >= 6 && currentTime < 12) {
            // Morning
            gradient = 'linear-gradient(to right, #6ab, #8cd, #bef, #dde)';
            // Hide the stars
            starRef.current!.style.display = 'none';
        } else if (currentTime >= 12 && currentTime < 14) {
            // Midday
            gradient = 'linear-gradient(to right, #dde, #bef, #8cd, #6ab)';
            // Hide the stars
            starRef.current!.style.display = 'none';
        } else if (currentTime >= 14 && currentTime < 18) {
            // Afternoon
            gradient = 'linear-gradient(to right, #6ab, #8cd, #bef, #dde)';
            // Hide the stars
            starRef.current!.style.display = 'none';
        } else if (currentTime >= 18 && currentTime < 22) {
            // Evening
            gradient = 'linear-gradient(to right, #1E3C72, #2A5298)';
            // Hide the stars
            starRef.current!.style.display = 'none';
        } else {
            // Night
            gradient = 'linear-gradient(to right, #000, #004)';
            // Show the stars
            starRef.current!.style.display = 'block';
        }

        // Set the gradient as the background of the sky div
        skyRef.current!.style.background = gradient;
    }, []);

    const stars = React.useMemo(() => {
        // Génération de la liste d'étoiles aléatoires
        const stars = [];
        for (let i = 0; i < 50; i++) {
            const size = Math.random() * 3 + 1; // Taille aléatoire entre 1 et 4
            const luminosity = Math.random() * 0.5 + 0.5; // Luminosité aléatoire entre 0.5 et 1
            const x = Math.random() * 100; // Position aléatoire en x entre 0 et 100
            const y = Math.random() * 100; // Position aléatoire en y entre 0 et 100
            const shouldTwinkle = Math.random() >= 0.5; // 50% chance of twinkling
            stars.push({ size, luminosity, x, y, shouldTwinkle });
        }
        return stars;
    }, []);
    
    React.useEffect(() => {
        // Set the initial sky color based on the current time
        updateSkyColor();

        // Update the sky color every 5 seconds
        const intervalId = setInterval(updateSkyColor, 5000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [updateSkyColor]);
    
    return (
        <div className={styles.sky} ref={skyRef}>
            <div className={styles.character}></div>
            <div className={styles.cloud_one} style={{animationDelay: `calc(0s + (${Math.random()} * 5s))`}}></div>
            <div className={styles.cloud_two} style={{animationDelay: `calc(0s + (${Math.random()} * 5s))`}}></div>
            <div className={styles.stars} ref={starRef}>
                {stars.map((star, index) => (
                    <div
                        key={index}
                        className={styles.star}
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            top: `${star.y}%`,
                            left: `${star.x}%`,
                            animation: `${star.shouldTwinkle ? `star-twinkle ${Math.random() * 3 + 1}s infinite` : 'none'}`,
                            opacity: star.luminosity,
                        }}
                    />
                ))}
            </div>
        </div>
    );

};

export default Decor;