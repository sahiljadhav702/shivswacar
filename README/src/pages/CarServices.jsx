import { Wrench } from 'lucide-react';
import { Droplets } from 'lucide-react';
import { Battery } from 'lucide-react';
import { Gauge } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Star } from 'lucide-react';

//     { icon: <Wrench size={32} />, name: 'General Service', desc: 'Comprehensive checkup and oil change.' },
//     { icon: <Droplets size={32} />, name: 'Car Wash & Detail', desc: 'Deep cleaning inside and out.' },
//     { icon: <Battery size={32} />, name: 'Battery Replacement', desc: 'High quality batteries with warranty.' },
//     { icon: <Gauge size={32} />, name: 'Performance Tuning', desc: 'Optimize your engine for better output.' },
//   ];

//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
//           gap: '2rem',
//           marginTop: '3rem',
//           textAlign: 'left'
//           {services.map((svc, i) => (
//                 {svc.icon}
//           ))}
//   );
// export default CarServices;




import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CarServices = () => {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: <Wrench size={36} />,
      name: 'General Service',
      desc: 'Comprehensive checkup and oil change with multi-point inspection.',
      features: ['Oil Change', 'Filter Replacement', 'Multi-point Inspection'],
      price: '$89',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: <Droplets size={36} />,
      name: 'Car Wash & Detail',
      desc: 'Deep cleaning inside and out with premium care products.',
      features: ['Exterior Polish', 'Interior Detailing', 'Ceramic Coating'],
      price: '$149',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: <Battery size={36} />,
      name: 'Battery Replacement',
      desc: 'High quality batteries with 3-year warranty and installation.',
      features: ['Battery Testing', 'Professional Installation', '3-Year Warranty'],
      price: '$199',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: <Gauge size={36} />,
      name: 'Performance Tuning',
      desc: 'Optimize your engine for better output and fuel efficiency.',
      features: ['ECU Remapping', 'Dyno Testing', 'Fuel Optimization'],
      price: '$299',
      color: 'from-orange-500 to-red-400'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-yellow-200/20 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-100/10 to-pink-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-2 rounded-full mb-4 backdrop-blur-sm border border-blue-200/30">
            <Sparkles size={18} className="text-blue-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premium Auto Care
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of professional car care services designed to keep your vehicle in pristine condition.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((svc, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02] opacity-0 animate-on-scroll border border-white/50"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Glowing Border Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${svc.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm group-hover:blur-md`}></div>

              {/* Card Content */}
              <div className="relative p-6 bg-white/90 backdrop-blur-sm rounded-2xl h-full flex flex-col">
                {/* Icon with Gradient */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${svc.color} p-3.5 text-white shadow-lg mb-4 transform group-hover:rotate-6 transition-transform duration-300`}>
                  {svc.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {svc.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{svc.desc}</p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {svc.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${svc.color}`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {svc.price}
                    </span>
                    <span className="text-sm text-gray-500">/service</span>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="group/btn relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Book Now
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: <Shield size={24} />, label: 'Certified Professionals', value: '100+' },
            { icon: <Clock size={24} />, label: 'Years of Experience', value: '15+' },
            { icon: <Star size={24} />, label: 'Happy Customers', value: '5K+' },
            { icon: <Wrench size={24} />, label: 'Services Offered', value: '50+' },
          ].map((item, idx) => (
            <div key={idx} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/80 transition-all duration-300 hover:scale-105">
              <div className="text-blue-600 mb-2 flex justify-center">{item.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{item.value}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -30px) rotate(5deg); }
        }

        @keyframes floatDelay {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, 30px) rotate(-5deg); }
        }

        .animate-fadeIn {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: floatDelay 10s ease-in-out infinite;
        }

        .animate-on-scroll {
          opacity: 0;
        }

        .animate-on-scroll.animate-fadeInUp {
          opacity: 1;
        }

        /* Hover Card Effect */
        .group:hover .group-hover\\:shadow-blue-500\\/25 {
          box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.25);
        }

        /* Smooth Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default CarServices;
