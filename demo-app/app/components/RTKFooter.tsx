const Footer = () => {
  return (
    <footer className="absolute bottom-0 left-0 right-0 text-sm flex flex-row items-center font-mono py-2 light:text-gray-700 text-orange-200 justify-center  border-t border-orange-200/20 light:border-orange-300 bg-[#040404] light:bg-white">
      Cloudflare &#8201;
      <a
        href="https://www.cloudflare.com/en-gb/website-terms/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-inherit transition-colors underline underline-offset-4"
      >
        Terms of Use
      </a>
    </footer>
  );
};

export default Footer;
