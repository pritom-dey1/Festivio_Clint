import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Calendar, MapPin, DollarSign, Users, X } from "lucide-react";

const stripePromise = loadStripe("pk_test_51ScBIzIcsp8vYrfuOGzx1pmCiFj3QtdIV5zUODGHSvcc4NBx7bkgi60g2GNwwJaNm4MQPI9H5h1286ZrEK3tOahU00LVqZcGzD");

const Toast = ({ message, type, onClose }) => {
  setTimeout(() => onClose(), 2000);
  return (
    <div className={`fixed top-5 right-5 px-4 py-2 rounded-xl text-white ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {message}
    </div>
  );
};

const useToast = () => {
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });
  const ToastContainer = () => toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null;
  return { showToast, ToastContainer };
};

const EventPaymentForm = ({ clientSecret, event, user, onSuccess, showToast }) => {
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
        showToast(error.message, "error");
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        const paymentRes = await axios.post(
          "https://server-1kb7.onrender.com/api/payments",
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

        await axios.post(
          "https://server-1kb7.onrender.com/api/event-registrations",
          {
            eventId: event._id,
            clubId: event.clubId,
            userId: user._id,
            userEmail: user.email,
            paymentId: paymentRes.data._id,
          },
          { withCredentials: true }
        );

        showToast("Registration successful");
        onSuccess();
      }
    } catch (err) {
      if (err.response?.data?.error === "You have already registered for this event.") {
        showToast("You have already registered for this event.", "error");
      } else {
        showToast("Payment failed", "error");
      }
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
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const { showToast, ToastContainer } = useToast();

  // ✅ Check if user already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (!user) return;
      try {
        const res = await axios.get("https://server-1kb7.onrender.com/api/event-registrations/my", { withCredentials: true });
        const registered = res.data.some(r => r.eventId === event._id);
        setAlreadyRegistered(registered);
      } catch (err) {
        console.error(err);
      }
    };
    checkRegistration();
  }, [event._id, user]);

  const handleRegister = async () => {
    if (!user || !user._id) return showToast("Please login first", "error");
    if (alreadyRegistered) return showToast("You have already registered for this event.", "error");

    if (event.isPaid) {
      try {
        const res = await axios.post(
          "https://server-1kb7.onrender.com/api/payments/create-payment-intent",
          { amount: event.eventFee * 100, clubId: event.clubId },
          { withCredentials: true }
        );
        setClientSecret(res.data.clientSecret);
        setModalOpen(true);
      } catch (_) {
        showToast("Failed to start payment", "error");
      }
      return;
    }

    try {
      await axios.post(
        "https://server-1kb7.onrender.com/api/event-registrations",
        {
          eventId: event._id,
          clubId: event.clubId,
          userId: user._id,
          userEmail: user.email,
        },
        { withCredentials: true }
      );

      setAlreadyRegistered(true);
      showToast("Registered successfully");
    } catch (_) {
      showToast("Registration failed", "error");
    }
  };
 const cutText = (text, limit = 100) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};
  return (
    <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300">
      <ToastContainer />
      <h3 className="text-2xl font-bold text-white">{event.title}</h3>

      <p className="text-gray-300">  {cutText(event.description, 120)}
</p>

      <div className="flex flex-col gap-2 mt-2 text-gray-400">
        <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /><span>{new Date(event.eventDate).toLocaleDateString()}</span></div>
        <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /><span>{event.location}</span></div>
        <div className="flex items-center gap-2"><DollarSign className="w-5 h-5" /><span>{event.isPaid ? `$${event.eventFee}` : "Free"}</span></div>
        <div className="flex items-center gap-2"><Users className="w-5 h-5" /><span>{event.maxAttendees} max attendees</span></div>
      </div>

      <button
        onClick={handleRegister}
        disabled={alreadyRegistered}
        className={`mt-4 px-4 py-2 rounded-xl font-semibold w-full text-white transition-all bg-indigo-600 hover:bg-indigo-700`}
      >
        {alreadyRegistered ? "Already Registered" : event.isPaid ? "Register & Pay" : "Register Now"}
      </button>

      {modalOpen && clientSecret && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] p-6 rounded-xl w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-300" onClick={() => setModalOpen(false)}>
              <X className="w-5 h-5" />
            </button>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <EventPaymentForm
                event={event}
                user={user}
                onSuccess={() => { setModalOpen(false); setAlreadyRegistered(true); }}
                showToast={showToast}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
