// src/components/Events/EventCard.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Calendar, MapPin, DollarSign, Users, X } from "lucide-react";

const stripePromise = loadStripe("pk_test_51ScBIzIcsp8vYrfuOGzx1pmCiFj3QtdIV5zUODGHSvcc4NBx7bkgi60g2GNwwJaNm4MQPI9H5h1286ZrEK3tOahU00LVqZcGzD");

// Payment Form for paid events
const EventPaymentForm = ({ clientSecret, event, user, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

if (paymentIntent && paymentIntent.status === "succeeded") {
  // Save Payment record
  const paymentRes = await axios.post(
    "http://localhost:5000/api/payments",
    {
      userId: user._id,
      userEmail: user.email,
      amount: event.eventFee,
      type: "event",
      clubId: event.clubId,
      eventId: event._id,
      stripePaymentIntentId: paymentIntent.id,
      status: "success",
    },
    { withCredentials: true }
  );

  // Save Event Registration
  await axios.post(
    "http://localhost:5000/api/event-registrations",
    {
      eventId: event._id,
      clubId: event.clubId,
      paymentId: paymentRes.data._id,
    },
    { withCredentials: true }
  );

  toast.success("Registration successful!");

  onSuccess(); // modal close
}
    } catch (err) {
      console.error(err);
      toast.error("Payment/Register error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
      >
        {loading ? "Processing..." : "Pay & Register"}
      </button>
    </form>
  );
};

const EventCard = ({ event, user }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");


  const handleRegister = async () => {
    if (!user || !user._id) {
      return toast.error("Please login first");
    }

    if (event.isPaid) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/payments/create-payment-intent",
          { amount: event.eventFee * 100, clubId: event.clubId },
          { withCredentials: true }
        );
        setClientSecret(res.data.clientSecret);
        setModalOpen(true);
      } catch (err) {
        console.error(err);
        toast.error("Failed to start payment");
      }
    } else {
      try {
        await axios.post(
          "http://localhost:5000/api/event-registrations",
          { eventId: event._id, clubId: event.clubId },
          { withCredentials: true }
        );
        toast.success("Registered successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Registration failed");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300">
      <h3 className="text-2xl font-bold text-white">{event.title}</h3>
      <p className="text-gray-300">{event.description}</p>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-5 h-5" />
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-5 h-5" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <DollarSign className="w-5 h-5" />
          <span>{event.isPaid ? `$${event.eventFee}` : "Free"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="w-5 h-5" />
          <span>{event.maxAttendees} max attendees</span>
        </div>
      </div>

      <button
        onClick={handleRegister}
        className={`mt-4 px-4 py-2 rounded-xl font-semibold w-full text-white transition-all ${
          event.isPaid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {event.isPaid ? "Register & Pay" : "Register Now"}
      </button>

      {modalOpen && clientSecret && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] p-6 rounded-xl w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-300"
              onClick={() => setModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <EventPaymentForm
                event={event}
                user={user}
                onSuccess={() => setModalOpen(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
