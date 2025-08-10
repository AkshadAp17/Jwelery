import { Phone } from "lucide-react";

export default function CallButton() {
  return (
    <div className="fixed bottom-24 right-6 z-40">
      <a
        href="tel:+919876543210"
        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        title="Call us now"
      >
        <Phone className="w-5 h-5 text-white" />
      </a>
    </div>
  );
}
