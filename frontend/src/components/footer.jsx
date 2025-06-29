// components/footer.jsx
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const footer = () => {
  return (
    <footer className="bg-sky-100 text-sky-900 mt-12 py-6 border-t border-sky-200">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-1">Contact Us</h3>
          <p className="text-sm">Email: contact@brandname.com</p>
          <p className="text-sm">Phone: +123 456 789</p>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 text-xl">
          <a href="#" className="hover:text-sky-600" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-sky-600" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-sky-600" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default footer;
