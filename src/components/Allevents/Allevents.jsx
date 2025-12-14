// src/pages/Allevents.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/Authcontext";
import EventCard from "./EventCard"; // Path ঠিক করে নাও
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import DarkVeil from "../Hero/DarkVeliBanner";

const Allevents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState({}); // user registered map

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch user's memberships
        const clubsRes = await axios.get(
          "https://server-1kb7.onrender.com/api/memberships/me",
          { withCredentials: true }
        );
        const clubIds = clubsRes.data.map(m => m.clubId._id || m.clubId);

        if (clubIds.length === 0) {
          setEvents([]);
          return;
        }

        // 2️⃣ Fetch events for each club
        const allEvents = [];
        for (const id of clubIds) {
          const res = await axios.get(
            `https://server-1kb7.onrender.com/events/club/${id}`,
            { withCredentials: true }
          );
          allEvents.push(...res.data);
        }
        setEvents(allEvents);

        // 3️⃣ Fetch user's registered events
        const regRes = await axios.get(
          "https://server-1kb7.onrender.com/eventRegistrations/my",
          { withCredentials: true }
        );
        const regMap = {};
        regRes.data.forEach(r => {
          regMap[r.eventId] = r.status;
        });
        setRegisteredEvents(regMap);

      } catch (err) {
        console.error(err);
        toast.error("Events load করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchEvents();
  }, [user]);

  // handle event registration
  const handleRegister = async (event) => {
    if (!user || !user._id) {
      toast.error("দয়া করে লগইন করুন।");
      return;
    }

    // Free event
    if (event.fee === 0) {
      try {
        const res = await axios.post(
          "https://server-1kb7.onrender.com/eventRegistrations",
          { eventId: event._id, clubId: event.clubId, paymentId: null },
          { withCredentials: true }
        );
        setRegisteredEvents(prev => ({ ...prev, [event._id]: "registered" }));
        toast.success("Successfully registered!");
      } catch (err) {
        console.error(err);
        toast.error("Registration failed.");
      }
    } else {
  
      toast.error("Paid event. Payment flow not implemented here yet.");
  
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Banner + DarkVeil */}
      <div className="relative w-full  overflow-hidden rounded-b-3xl shadow-2xl">
        <DarkVeil />
        <motion.h1
          className="absolute text-center bottom-1/2 left-1/2 transform translate-x-[-50%]  text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg uppercase"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          All Events
        </motion.h1>
      </div>

      {/* Events Grid */}
<div className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 gap-6">
  {loading ? (
    <p className="text-white text-center col-span-full">Loading events...</p>
  ) : events.length === 0 ? (
    !registeredEvents ? (
      <p className="text-white text-center col-span-full">
        Please join a Club to participate in any event
      </p>
    ) : (
      <p className="text-white text-center col-span-full">
        There is no event in your added club
      </p>
    )
  ) : (
    events.map(event => (
     <EventCard
  key={event._id}
  event={event}
  user={user}
  isRegistered={!!registeredEvents[event._id]} 
  onRegister={() => handleRegister(event)}
/>
    ))
  )}
</div>
    </div>
  );
};

export default Allevents;
