import manzilImage from "/manzil1.png";

const About = () => {
  return (
    <div className="min-h-screen px-4 pt-10 text-gray-800 md:px-8 lg:px-10">
      <div className="w-full max-w-5xl p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg md:p-10 lg:p-12">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          {/* Text Content */}
          <div className="w-full space-y-4 text-justify md:w-1/2 md:pr-6">
            <p className="text-lg leading-relaxed md:text-xl">
              Welcome to our magazine website! We offer the latest articles on various topics, including 
              technology, lifestyle, health, and more. Stay updated with fresh and dynamic content tailored 
              to keep you informed and engaged.
            </p>
            <p className="text-lg leading-relaxed md:text-xl">
              Bharati Vidyapeeth&apos;s Institute of Computer Applications and Management (BVICAM), New Delhi, is 
              one of the 187 institutions under Bharati Vidyapeeth, Pune. With a clear vision and mission to 
              serve the cause of higher education in India, the Institute started conducting the 
              Master of Computer Applications (MCA) programme from the academic year 2002-2003.
            </p>
            <p className="text-lg leading-relaxed md:text-xl">
              The Institute is affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), 
              Sector 16C Dwarka, New Delhi-78. It is also approved by the All India Council for Technical 
              Education (AICTE), Ministry of HRD, Government of India, New Delhi.
            </p>
          </div>

          {/* Image Section */}
          <div className="flex justify-center w-full md:w-1/2 md:justify-end md:pl-6">
            <img
              src={manzilImage}
              alt="MANZIL"
              className="h-auto max-w-full rounded-lg shadow-lg"
              style={{ maxWidth: "450px", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
