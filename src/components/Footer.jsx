import React from "react";
import { Link } from "react-router-dom";
import { Globe, Share2, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-section-gap-md bg-surface-container-highest border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-start px-gutter w-full max-w-[1440px] mx-auto gap-12">
        <div className="max-w-xs">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
            OLIV'OR
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            Elevating the humble olive to its rightful place as the gold of the
            Mediterranean. Artisan crafted, heritage born.
          </p>
          <div className="flex items-center gap-4 text-outline">
            <a
              className="hover:text-primary transition-colors"
              href="#"
              aria-label="Website"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              className="hover:text-primary transition-colors"
              href="#"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </a>
            <a
              className="hover:text-primary transition-colors"
              href="#"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <h4 className="text-label-lg font-label-lg uppercase tracking-widest text-primary">
              Estate
            </h4>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
              to="/heritage"
            >
              Our History
            </Link>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
              href="#"
            >
              The Groves
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
              href="#"
            >
              Press & Awards
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-label-lg font-label-lg uppercase tracking-widest text-primary">
              Assistance
            </h4>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
              href="#"
            >
              Contact Concierge
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
              href="#"
            >
              Shipping & Returns
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md"
              href="#"
            >
              Stockists
            </a>
          </div>
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <h4 className="text-label-lg font-label-lg uppercase tracking-widest text-primary">
              Newsletter
            </h4>
            <p className="text-label-sm font-label-sm text-outline">
              Join our private list for harvest updates and limited releases.
            </p>
            <div className="flex mt-2">
              <input
                className="bg-surface border border-outline-variant focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none rounded-l-lg border-r-0 w-full px-4 py-2 text-label-lg"
                placeholder="Email Address"
                type="email"
              />
              <button className="bg-primary hover:bg-primary-container text-white px-6 py-2 rounded-r-lg uppercase font-label-lg tracking-widest transition-colors duration-300">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 px-gutter w-full max-w-[1440px] mx-auto border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-body-md text-body-md text-on-surface-variant opacity-70 text-center md:text-left">
          © 2026 OLIV'OR TUNISIA. THE ESSENCE OF LUXURY.{" "}
        </span>
        <div className="flex items-center gap-8 text-label-sm font-label-sm text-outline uppercase tracking-widest">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
