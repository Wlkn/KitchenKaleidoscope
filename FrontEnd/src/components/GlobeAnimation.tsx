// GlobeAnimation.tsx
import React, { useEffect } from "react";

const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const animate = (world: any) => {
    world.style.setProperty("--world-left", `${rand(-10, 100)}%`);
    world.style.setProperty("--world-top", `${rand(-10, 100)}%`);

    world.style.animation = "none";
    world.offsetHeight;
    world.style.animation = "";
};

const GlobeAnimation: React.FC = () => {
    useEffect(() => {
        let index = 0;
        const interval = 1000;
        const worlds = Array.from(
            document.getElementsByClassName("world-globe")
        );

        worlds.forEach((world) => {
            setTimeout(() => {
                animate(world);

                setInterval(() => animate(world), 1000);
            }, index++ * (interval / 3));
        });
    }, []);

    return <></>;
};

export default GlobeAnimation;
