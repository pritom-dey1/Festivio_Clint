import { useState } from "react";

export const Toast = ({ message, type, onClose }) => {
  setTimeout(() => onClose(), 2000);

  return (
    <div
      className={`
        fixed top-5 right-5 px-4 py-2 rounded-xl text-white shadow-lg
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
        animate-fade-in
      `}
    >
      {message}
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const ToastContainer = () =>
    toast ? (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    ) : null;

  return { showToast, ToastContainer };
};
