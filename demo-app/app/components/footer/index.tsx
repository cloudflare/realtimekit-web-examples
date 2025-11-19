const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full text-sm flex flex-row items-center font-mono py-2 text-orange-200 justify-center bg-[#040404] light:bg-white border-t border-orange-200/20 light:border-orange-300">
      Cloudflare &#8201;
      <a
        href="https://www.cloudflare.com/en-gb/website-terms/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-200 hover:text-orange-300 light:text-gray-700 light:hover:text-gray-900 transition-colors underline underline-offset-4"
      >
        Terms of Use
      </a>
    </footer>
  );
};

export default Footer;
