import { Link } from "react-router-dom";
import { 
  Laptop, Dumbbell, Palette, Music, BookOpen, Gamepad, Camera, Film, Briefcase, MapPin, HelpCircle, ArrowRight 
} from "lucide-react"; // Theatre => Film

const ClubCard = ({ club }) => {

  const categoryIcons = {
    Technology: <Laptop size={18} />,
    Sports: <Dumbbell size={18} />,
    Arts: <Palette size={18} />,
    Music: <Music size={18} />,
    Literature: <BookOpen size={18} />,
    Gaming: <Gamepad size={18} />,
    Photography: <Camera size={18} />,
    Science: <HelpCircle size={18} />, 
    Drama: <Film size={18} />, // Theatre icon replaced
    Business: <Briefcase size={18} />,
    Travel: <MapPin size={18} />,
    Other: <HelpCircle size={18} /> // Default fallback
  };

  return (
    <div
      className="
      relative group rounded-2xl overflow-hidden
      bg-white/10 backdrop-blur-xl
      border border-white/20 shadow-xl
      hover:shadow-2xl transition-all duration-300
      hover:scale-[1.03]
    "
    >
      {/* Banner Image */}
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={club.bannerImage}
          alt={club.clubName}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <h3 className="absolute bottom-3 left-4 text-xl font-semibold text-white drop-shadow-md">
          {club.clubName}
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">

        <p className="text-sm text-gray-200/90 mb-4 line-clamp-2">
          {club.description}
        </p>

        <div className="flex justify-between items-center">

          {/* Category with Dynamic Icon */}
          <div className="flex items-center gap-2 text-gray-300">
            {categoryIcons[club.category] || <HelpCircle size={18} />}
            <span className="text-sm">{club.category}</span>
          </div>

          {/* View Button */}
          <Link
            to={`/clubs/${club._id}`}
            className="
              flex items-center gap-1
              px-4 py-1.5 rounded-full 
              bg-indigo-600 text-white text-sm font-medium
              hover:bg-indigo-700 transition-all
            "
          >
            View
            <ArrowRight size={15} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
