"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppSupportButtonProps {
  title?: string;
  message?: string;
  phoneNumber?: string; 
  className?: string;
}

export default function WhatsAppSupportButton({
  title = "Contact Support",
  message = "Hi CrackDSA, I need help with my account.",
  phoneNumber = "919956217210", // Default support number
  className = ""
}: WhatsAppSupportButtonProps) {
  
  const handleRedirect = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleRedirect}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-bold text-white hover:bg-[#20bd5a] transition-colors shadow-sm shadow-[#25D366]/20 ${className}`}
    >
      <MessageCircle size={16} />
      {title}
    </button>
  );
}
