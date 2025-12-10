// src/pages/ClubDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, DollarSign, X } from "lucide-react";
import ClubCard from "../components/Global/ClubCard";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

// Stripe public key
const stripePromise = loadStripe("pk_test_51ScBIzIcsp8vYrfuOGzx1pmCiFj3QtdIV5zUODGHSvcc4NBx7bkgi60g2GNwwJaNm4MQPI9H5h1286ZrEK3tOahU00LVqZcGzD");

const CheckoutForm = ({ clientSecret, clubId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        if (!user || !user._id) {
          toast.error("User info missing. Please login again.");
          setLoading(false);
          return;
        }

        // Save payment
        const paymentData = {
          userId: user._id,
          userEmail: user.email,
          amount: paymentIntent.amount / 100,
          type: "membership",
          clubId,
          stripePaymentIntentId: paymentIntent.id,
          status: "success",
        };

        const paymentRes = await axios.post(
          "http://localhost:5000/api/payments",
          paymentData,
          { withCredentials: true }
        );

        // Create membership
        await axios.post(
          "http://localhost:5000/api/memberships",
          { userId: user._id, clubId, status: "active", paymentId: paymentRes.data._id },
          { withCredentials: true }
        );

        // ✅ Success: call onSuccess for modal close + toast
        onSuccess(); // parent component এ setModalOpen(false) + toast handle করা হবে
      }
    } catch (err) {
      console.error("Payment submit error:", err);
      toast.error("Payment বা membership save করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold w-full"
      >
        {loading ? "Processing..." : "Pay & Join"}
      </button>
    </form>
  );
};


const ClubDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [relatedClubs, setRelatedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [addedMap, setAddedMap] = useState({}); // club-specific added state

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/clubs/${id}`);
        setClub(res.data);

        const allClubsRes = await axios.get("http://localhost:5000/api/clubs");
        const others = allClubsRes.data.filter(c => c._id !== id);
        setRelatedClubs(others.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  const handleAddNow = async () => {
    if (!user || !user._id) {
      toast.error("দয়া করে লগইন করুন।");
      return;
    }

    if (addedMap[club._id]) return; // শুধু ওই ক্লাবের জন্য check

    if (club.membershipFee === 0) {
      try {
        const paymentRes = await axios.post(
          "http://localhost:5000/api/payments",
          { userId: user._id, userEmail: user.email, amount: 0, type: "membership", clubId: club._id, status: "success" },
          { withCredentials: true }
        );

        await axios.post(
          "http://localhost:5000/api/memberships",
          { userId: user._id, clubId: club._id, status: "active", paymentId: paymentRes.data._id },
          { withCredentials: true }
        );

        toast.success("তুমি সফলভাবে ক্লাবের সদস্য হয়েছো!");
        setAddedMap(prev => ({ ...prev, [club._id]: true }));
      } catch (err) {
        console.error(err);
        toast.error("Membership join করতে সমস্যা হয়েছে।");
      }
    } else {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/payments/create-payment-intent",
          { amount: club.membershipFee * 100, clubId: club._id },
          { withCredentials: true }
        );
        setClientSecret(res.data.clientSecret);
        setModalOpen(true);
      } catch (err) {
        console.error(err);
        toast.error("Payment শুরু করতে সমস্যা হয়েছে।");
      }
    }
  };

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;
  if (!club) return <p className="text-white text-center mt-20">Club not found.</p>;

  return (
    <div className="relative w-full min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-b-3xl shadow-2xl">
        <img src={club.bannerImage} alt={club.clubName} className="w-full h-full object-cover brightness-75" />
        <motion.h1
          className="absolute bottom-5 left-15 text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg uppercase"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {club.clubName}
        </motion.h1>
      </div>

      {/* Club Info */}
      <div className="max-w-7xl flex mx-auto px-4 mt-8 flex flex-col md:flex-col gap-8">
        <div className="flex justify-between">
          <div className="w-[80%] flex flex-col gap-2">
            <p className="text-gray-300 text-[20px]">{club.description}</p>
            <div className="flex items-center gap-4 text-gray-200">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <span>{club.location}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-200">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span>Membership Fee: ${club.membershipFee}</span>
            </div>
          </div>

          <div>
            <button
              onClick={handleAddNow}
              disabled={addedMap[club._id]}
              className={`mt-6 px-6 py-3 text-white rounded-xl font-semibold w-fit transition-all duration-300 shadow-lg flex items-center gap-2 ${
                addedMap[club._id] ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {addedMap[club._id] ? "Added" : "Add Now"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Related Clubs */}
        {relatedClubs.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg uppercase text-center mb-5">
              Other Clubs
            </h2>
            <div className="flex gap-4">
              {relatedClubs.map((c) => (
                <ClubCard key={c._id} club={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && clientSecret && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] p-6 rounded-xl w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-300" onClick={() => setModalOpen(false)}>
              <X className="w-5 h-5" />
            </button>
<Elements stripe={stripePromise} options={{ clientSecret }}>
  <CheckoutForm
    clubId={club._id}
    onSuccess={() => {
      toast.success("You successfully joined the club!");
      setModalOpen(false); // 
      setAddedMap(prev => ({ ...prev, [club._id]: true }));
    }}
  />
</Elements>

          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetailsPage;
