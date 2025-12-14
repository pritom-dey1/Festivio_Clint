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
          "https://server-1kb7.onrender.com/api/payments",
          paymentData,
          { withCredentials: true }
        );

        await axios.post(
          "https://server-1kb7.onrender.com/api/memberships",
          { userId: user._id, clubId, status: "active", paymentId: paymentRes.data._id },
          { withCredentials: true }
        );

        onSuccess();
      }
    } catch (err) {
      console.error("Payment submit error:", err);
      toast.error("Payment বা membership save করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="flex flex-col gap-3 w-full max-w-[360px] sm:max-w-[400px] mx-auto"
>
  <div className="w-full">
    <PaymentElement />
  </div>

  {error && (
    <p className="text-red-500 text-xs sm:text-sm text-center">
      {error}
    </p>
  )}

  <button
    type="submit"
    disabled={!stripe || loading}
    className="mt-2 w-full py-3 sm:py-3.5 text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all"
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
  const [addedMap, setAddedMap] = useState({});

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://server-1kb7.onrender.com/api/clubs/${id}`);
        setClub(res.data);

        const allClubsRes = await axios.get("https://server-1kb7.onrender.com/api/clubs");
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
      toast.error("Please login first.");
      return;
    }

    if (addedMap[club._id]) return;

    if (club.membershipFee === 0) {
      try {
        const paymentRes = await axios.post(
          "https://server-1kb7.onrender.com/api/payments",
          { userId: user._id, userEmail: user.email, amount: 0, type: "membership", clubId: club._id, status: "success" },
          { withCredentials: true }
        );

        await axios.post(
          "https://server-1kb7.onrender.com/api/memberships",
          { userId: user._id, clubId: club._id, status: "active", paymentId: paymentRes.data._id },
          { withCredentials: true }
        );

        toast.success("You are now a member!");
        setAddedMap(prev => ({ ...prev, [club._id]: true }));
      } catch (err) {
        console.error(err);
        toast.error("Membership already added");
      }
    } else {
      try {
        const res = await axios.post(
          "https://server-1kb7.onrender.com/api/payments/create-payment-intent",
          { amount: club.membershipFee * 100, clubId: club._id },
          { withCredentials: true }
        );
        setClientSecret(res.data.clientSecret);
        setModalOpen(true);
      } catch (err) {
        console.error(err);
        toast.error("An Admin or a Manager can't add to any club");
      }
    }
  };

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;
  if (!club) return <p className="text-white text-center mt-20">Club not found.</p>;

  return (
    <div className="relative w-full min-h-screen">

      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-b-3xl shadow-2xl">
        <img src={club.bannerImage} alt={club.clubName} className="w-full h-full object-cover brightness-75" />

        <motion.h1
          className="absolute bottom-5 left-4 md:left-10 text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg uppercase"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {club.clubName}
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col gap-8">

        <div className="flex flex-col md:flex-row justify-between gap-6">

          <div className="w-full md:w-3/4 flex flex-col gap-3">
            <p className="text-gray-300 text-base md:text-lg">{club.description}</p>

            <div className="flex items-center gap-3 text-gray-200 text-sm md:text-base">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <span>{club.location}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-200 text-sm md:text-base">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span>Membership Fee: ${club.membershipFee}</span>
            </div>
          </div>

          <div className="flex md:justify-end">
            <button
              onClick={handleAddNow}
              disabled={addedMap[club._id]}
              className={`px-6 py-3 text-white rounded-xl font-semibold   h-fit   transition-all duration-300 shadow-lg flex items-center gap-2 ${
                addedMap[club._id] ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {addedMap[club._id] ? "Added" : "Add Now"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {relatedClubs.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg uppercase text-center mb-6">
              Other Clubs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedClubs.map((c) => (
                <ClubCard key={c._id} club={c} />
              ))}
            </div>
          </div>
        )}
      </div>

{modalOpen && clientSecret && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
    <div className="bg-[#1a1a2e] p-4 sm:p-6 rounded-xl w-full max-w-[380px] sm:max-w-md relative">

      <button
        className="absolute top-3 right-3 text-gray-300"
        onClick={() => setModalOpen(false)}
      >
        <X className="w-5 h-5" />
      </button>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "night",
            variables: {
              spacingUnit: "4px",
              borderRadius: "12px"
            }
          }
        }}
      >
        <CheckoutForm
          clubId={club._id}
          onSuccess={() => {
            toast.success("You successfully joined the club!");
            setModalOpen(false);
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
