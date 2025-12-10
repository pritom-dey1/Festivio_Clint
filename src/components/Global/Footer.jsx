import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = t("footer.quickLinksItems", { returnObjects: true });
  const memberLinks = t("footer.memberItems", { returnObjects: true });

  return (
    <footer className="bg-black backdrop-blur-md border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-10" />
          </div>
          <p className="text-gray-100 text-sm">{t("footer.description")}</p>
          <div className="flex gap-3 mt-2 text-gray-200">
            <a href="#" className="hover:text-gray-300"><FaFacebookF /></a>
            <a href="#" className="hover:text-gray-300"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-300"><FaInstagram /></a>
            <a href="#" className="hover:text-gray-300"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-200 mb-3">{t("footer.quickLinks")}</h4>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-gray-400">{quickLinks.home}</Link></li>
            <li><Link to="/clubs" className="hover:text-gray-400">{quickLinks.clubs}</Link></li>
            <li><Link to="/events" className="hover:text-gray-400">{quickLinks.events}</Link></li>
            <li><Link to="/about" className="hover:text-gray-400">{quickLinks.about}</Link></li>
            <li><Link to="/contact" className="hover:text-gray-400">{quickLinks.contact}</Link></li>
          </ul>
        </div>

        {/* Member Links */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-3">{t("footer.member")}</h4>
          <ul className="flex flex-col gap-2 text-gray-200 text-sm">
            <li><Link to="/profile" className="hover:text-gray-400">{memberLinks.profile}</Link></li>
            <li><Link to="/dashboard" className="hover:text-gray-400">{memberLinks.dashboard}</Link></li>
            <li><Link to="/login" className="hover:text-gray-400">{memberLinks.login}</Link></li>
            <li><Link to="/register" className="hover:text-gray-400">{memberLinks.register}</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-3">{t("footer.contact")}</h4>
          <p className="text-gray-300 text-sm">{t("footer.address")}</p>
          <p className="text-gray-300 text-sm">{t("footer.email")}</p>
          <p className="text-gray-300 text-sm">{t("footer.phone")}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-gray-100 text-sm">
          &copy; {new Date().getFullYear()} ClubSphere. {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};
