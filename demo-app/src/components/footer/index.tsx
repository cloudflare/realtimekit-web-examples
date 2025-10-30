import { Icon } from "../icons";

const Footer = () => {
  const navigationLinks = [
    { label: "Docs", href: "https://docs.realtime.cloudflare.com/" },
    { label: "Explore", href: "https://realtime.cloudflare.com/" },
  ];

  const socialLinks = [
    {
      name: "github" as const,
      href: "https://github.com/cloudflare/realtime-kit",
    },
    {
      name: "code" as const,
      href: "https://github.com/cloudflare/realtime-kit",
    },
  ];

  return (
    <footer className="w-full px-4 md:px-12 py-8 md:py-12 bg-[#040404] light:bg-white border-t border-orange-200/20 light:border-orange-300">
      <div className="max-w-[94vw] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          {/* Left Section - Branding */}
          <div className="flex flex-col max-w-md gap-2">
            <h3 className="text-orange-50 light:text-neutral-700 text-2xl font-bold">
              RealtimeKit
            </h3>
            <p className="text-orange-50 light:text-neutral-700 text-sm italic">
              /ˈriːəltaɪmkɪt/
            </p>
            <p className="text-orange-50 light:text-neutral-700 text-sm">
              noun
            </p>
            <p className="text-orange-50 light:text-neutral-700 text-sm leading-relaxed">
              A toolkit for building & shipping real-time applications in
              minutes.
            </p>
            <p className="text-neutral-400 light:text-neutral-500 text-sm">
              Copyright © Cloudflare. since 2025. All rights reserved.
            </p>
          </div>

          {/* Right Section - Links and Social */}
          <div className="flex flex-col gap-6">
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-50 hover:text-orange-200  light:text-neutral-700 light:hover:text-neutral-900 text-sm flex items-center gap-2 transition-colors group"
                >
                  <span>{link.label}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  >
                    <path
                      d="M5 12h14m-7-7l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex gap-2 items-center">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-50 hover:text-orange-300 transition-colors light:text-neutral-700 light:hover:text-neutral-900"
                >
                  <Icon name={social.name} size={22} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
