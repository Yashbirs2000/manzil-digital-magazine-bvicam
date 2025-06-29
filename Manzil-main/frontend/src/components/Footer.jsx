const Footer = () => {
  return (
    <footer className="w-full font-sans text-black">
      {/* Top Section with Yellow Background */}
      <div className="px-2 py-2 from-blue-200 to-blue-300 bg-gradient-to-b md:px-12 lg:px-20">
        <div className="flex justify-center text-center">
          <p className="text-xl font-bold leading-relaxed drop-shadow-sm">
            A-4, Paschim Vihar, Opp. Paschim Vihar (East) Metro Station, Rohtak Road, New Delhi, Delhi 110063
          </p>
        </div>
      </div>

      {/* Image Section - No Background */}
      <div className="w-full">
        <img
          src="/footer.png"
          alt="Footer visual"
          className="object-cover w-full h-auto"
        />
      </div>

      {/* Bottom Section with Gradient Background */}
      <div className="py-2 from-blue-200 to-blue-300 bg-gradient-to-b">
        <p className="text-base font-semibold tracking-wide text-center drop-shadow-sm">
          © 2025 MANZIL BVICAM, New Delhi. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
