import React from "react";
import { useTranslation } from "react-i18next";
import { Typewriter } from "react-simple-typewriter";

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full h-screen flex items-center justify-center absolute px-4 text-center">
      <div className="w-full max-w-3xl mx-auto">

        <span className="uppercase text-sm md:text-base">
          {t("hero.subtitle")}
        </span>

        <h1 className="text-3xl md:text-6xl font-bold uppercase bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg leading-tight">
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

        <p className="text-sm md:text-xl mx-auto max-w-md md:max-w-5xl uppercase">
          {t("hero.description")}
        </p>

        <button className="px-6 py-3 rounded-md text-sm md:text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 uppercase mt-2">
          {t("hero.button")}
        </button>
        
      </div>
    </section>
  );
};
