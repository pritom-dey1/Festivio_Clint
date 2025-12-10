import React from "react";
import { useTranslation } from "react-i18next";
import { Typewriter } from "react-simple-typewriter";

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="w-7xl mx-auto px-6 text-center">
        {/* Subtitle */}
        <span className="uppercase ">{t("hero.subtitle")}</span>

        {/* Main Heading with Typewriter */}
        <h1 className="text-4xl md:text-6xl font-bold uppercase bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          <Typewriter
            words={t("hero.typewriter", { returnObjects: true })}
            loop={true}
            cursor
            cursorStyle="."
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h1>

        {/* Description */}
        <div className="flex w-full justify-center">
          <p className="text-[20px] w-[60%] uppercase">{t("hero.description")}</p>
        </div>

        {/* Button */}
        <button className="px-6 py-3 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 uppercase mt-1">
          {t("hero.button")}
        </button>
      </div>
    </section>
  );
};
