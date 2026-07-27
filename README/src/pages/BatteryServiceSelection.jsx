import { Battery } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Award } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Star } from 'lucide-react';
import { Check } from 'lucide-react';
import { Zap } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Truck } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { CircleCheck } from 'lucide-react';
import { Plus } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

//   // Extract data from location.state if it exists
//     regNumber: 'MH-12-AB-1234',
//     mobileNumber: '',
//     brand: 'HONDA',
//     model: 'CITY',
//     fuel: 'Petrol'
//     '2 Months / 1500 Km',
//     '1 Year / 10000 Km',
//     '2 Year / 20000 Km',
//     '3 Year / 30000 Km',
//     '4 Year / 40000 Km',
//     '5 Year / 50000 Km',
//     '6 Year / 60000 Km',
//     '7 Year / 70000 Km',
//     '8 Year / 80000 Km',
//     '9 Year / 90000 Km',
//     '10 Year / 100000 Kms'
//   ];

//   useEffect(() => {
//       try {
//         // Map backend data to frontend package format
//           id: pkg.id.toString(),
//           title: pkg.name,
//           desc: pkg.description || 'Comprehensive battery care with performance optimization.',
//           price: pkg.price,
//           oldPrice: pkg.price + Math.floor(pkg.price * 0.3), // Fake old price for UI
//           badge: 'Special Offer',
//           popular: index === 1, // Make second package popular
//           includes: pkg.description ? pkg.description.split(',').map(s => s.trim()) : ['Standard Inspection', 'Voltage Test', 'Cleaning']
//         setPackages(mappedPackages);
//         if (mappedPackages.length > 0) {
//           setSelectedPackage(mappedPackages[0].id);
//         console.error("Failed to fetch packages:", err);
//         setIsLoading(false);
//     fetchPackages();
//     {
//       id: 'Basic',
//       title: 'Basic Battery Care',
//       desc: 'Essential battery inspection and maintenance for everyday reliability.',
//       price: 499,
//       oldPrice: 799,
//       badge: '20% OFF',
//       includes: ['Battery Health Check', 'Terminal Cleaning', 'Voltage Test', 'Charging System Inspection', 'Water Level Check (if applicable)']
//     {
//       id: 'Standard',
//       title: 'Standard Battery Service',
//       desc: 'Complete battery maintenance with performance optimization.',
//       price: 999,
//       oldPrice: 1499,
//       badge: '35% OFF',
//       popular: true,
//       includes: ['Everything in Basic', 'Battery Charging', 'Load Test', 'Alternator Test', 'Electrical Connection Inspection']
//     {
//       id: 'Premium',
//       title: 'Premium Battery Protection',
//       desc: 'Comprehensive battery care with doorstep replacement support.',
//       price: 1499,
//       oldPrice: 2299,
//       badge: '40% OFF',
//       includes: ['Everything in Standard', 'Doorstep Installation', 'Jump Start Assistance', 'Battery Replacement Support', 'Warranty Assistance', 'Priority Service']
//   ];

//   // Use dynamic packages if available, otherwise fallback to default
//       { name: 'Air Filter', price: 0 },
//       { name: 'Engine Oil', price: 0 },
//       { name: 'Engine Oil Filter', price: 0 },
//       { name: 'AC Filter', price: 0 },
//       { name: 'Fuel Filter', price: 0 },
//       { name: 'Coolant', price: 0 },
//       { name: 'Spark Plugs', price: 0 },
//       { name: 'Brake Fluid', price: 0 },
//       { name: 'Manual Transmission', price: 0 }
//     ];

//     if (!interval || interval.includes('1500 Km')) {
//     // Standard for 10000km and above
//     parts[1].price = 1672; // Engine Oil
//     parts[2].price = 107;  // Engine Oil Filter

//     if (interval.includes('20000') || interval.includes('40000') || interval.includes('60000') || interval.includes('80000') || interval.includes('100000')) {
//       parts[0].price = 350; // Air Filter
//       parts[3].price = 350; // AC Filter
//     if (interval.includes('30000') || interval.includes('60000') || interval.includes('90000')) {
//       parts[5].price = 800; // Coolant
//     if (interval.includes('40000') || interval.includes('80000')) {
//       parts[4].price = 450; // Fuel Filter
//       parts[6].price = 600; // Spark Plugs
//       parts[7].price = 300; // Brake Fluid
//       parts[8].price = 1200; // Manual Transmission
//     'Genuine Parts', 'Certified Technicians', 'Transparent Pricing',
//     'Fast Service', 'Official Warranty', 'Expert Mechanics', 'Trusted by Thousands'
//   ];

//     { id: 's1', title: 'Battery Replacement', price: 299, icon: <Battery size={24} /> },
//     { id: 's2', title: 'Battery Health Check', price: 199, icon: <Shield size={24} /> },
//     { id: 's3', title: 'Jump Start Service', price: 399, icon: <Zap size={24} /> },
//     { id: 's4', title: 'Battery Charging', price: 249, icon: <Zap size={24} /> },
//     { id: 's5', title: 'Terminal Cleaning', price: 149, icon: <Wrench size={24} /> },
//     { id: 's6', title: 'Alternator Testing', price: 299, icon: <Settings size={24} /> },
//     { id: 's7', title: 'Warranty Assistance', price: 0, icon: <ShieldCheck size={24} />, freeText: 'Free' },
//     { id: 's8', title: 'Doorstep Installation', price: 0, icon: <Truck size={24} />, freeText: 'Free with Battery Purchase' },
//   ];

//     if (selectedAddons.find(a => a.id === service.id)) {
//       setSelectedAddons(selectedAddons.filter(a => a.id !== service.id));
//       setSelectedAddons([...selectedAddons, service]);
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
//         {/* Left Side */}
//             Select Service Interval
//           {/* Service Interval Premium Slider */}
//                 {selectedInterval || 'Slide to select interval'}
//               {selectedInterval && (
//                   {serviceIntervals.indexOf(selectedInterval) + 1} of {serviceIntervals.length}
//               )}
//               type="range" 
//               min="0" 
//               max={serviceIntervals.length - 1} 
//               step="1"
//               value={selectedInterval ? serviceIntervals.indexOf(selectedInterval) : 0}
//               onChange={(e) => setSelectedInterval(serviceIntervals[parseInt(e.target.value)])}
//               className="premium-brightness-slider"
//               style={{
//                 width: '100%',
//                 appearance: 'none',
//                 height: '8px',
//                 borderRadius: '8px',
//                 outline: 'none',
//                 cursor: 'pointer',
//                 background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(selectedInterval ? serviceIntervals.indexOf(selectedInterval) : 0) / (serviceIntervals.length - 1) * 100}%, #e5e7eb ${(selectedInterval ? serviceIntervals.indexOf(selectedInterval) : 0) / (serviceIntervals.length - 1) * 100}%, #e5e7eb 100%)`
//             />

//             .premium-brightness-slider::-webkit-slider-thumb {
//               -webkit-appearance: none;
//               appearance: none;
//               width: 16px;
//               height: 16px;
//               border-radius: 50%;
//               background: #fff;
//               cursor: pointer;
//               box-shadow: 0 0 8px rgba(0, 0, 0, 0.1), 0 0 0 4.5px #3b82f6;
//               transition: transform 0.1s ease;
//             .premium-brightness-slider::-webkit-slider-thumb:hover {
//               transform: scale(1.15);
//             .premium-brightness-slider::-webkit-slider-thumb:active {
//               transform: scale(0.95);
//             .premium-brightness-slider::-moz-range-thumb {
//               width: 16px;
//               height: 16px;
//               border-radius: 50%;
//               background: #fff;
//               cursor: pointer;
//               box-shadow: 0 0 8px rgba(0, 0, 0, 0.1), 0 0 0 4.5px #3b82f6;
//               border: none;
//               transition: transform 0.1s ease;
//             .premium-brightness-slider::-moz-range-thumb:hover {
//               transform: scale(1.15);
//             .premium-brightness-slider::-moz-range-thumb:active {
//               transform: scale(0.95);
//           `}</style>

//           {/* Parts Table */}
//           {selectedInterval && (
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//                 Parts & Pricing Details
//                     {currentParts.map((part, idx) => (
//                     ))}
//           )}

//           {/* Individual Services */}
//             className="bss-section-title"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             style={{ marginTop: '3rem' }}
//           >
//             Individual Services & Add-ons
//             {individualServices.map((service, idx) => {
//                   key={service.id}
//                   className="bss-service-card"
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={fadeInUp}
//                   transition={{ delay: (idx % 4) * 0.1 }}
//                 >
//                     {service.freeText ? service.freeText : `₹${service.price}`}
//                     className={`bss-btn ${isSelected ? 'bss-btn-outline' : 'bss-btn-secondary'}`}
//                     style={{ padding: '0.5rem' }}
//                     onClick={() => handleAddonToggle(service)}
//                   >
//                     {isSelected ? 'Added' : <><Plus size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Add</>}
//               );
//         {/* Right Sidebar */}
//               {currentParts.filter(p => p.price > 0).length > 0 ? (
//                 currentParts.filter(p => p.price > 0).map((part, idx) => (
//                 ))
//               ) : (
//               )}

//               {selectedAddons.map(addon => (
//               ))}

//                 className="bss-btn bss-btn-primary"
//                 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
//                 onClick={() => {
//                   if (!selectedInterval) {
//                     alert("Please select a service interval first.");
//                     return;
//                     ? 'Includes: ' + currentParts.filter(p => p.price > 0).map(p => p.name).join(', ') 
//                     : 'Basic Inspection';

//                     ? ' | Addons: ' + selectedAddons.map(a => a.title).join(', ') 
//                     : '';

//                   navigate('/garage-selection', {
//                     state: {
//                       vehicle: {
//                         regNumber, brand, model, fuel, batteryType: '12V 45Ah', ownerName: location.state?.ownerName, mobileNumber: location.state?.mobileNumber
//                       package: {
//                         name: `Service Interval: ${selectedInterval} (${partNames}${addonNames})`,
//                         price: grandTotal
//               >
//                 Select Garage
//                 Request Callback
//       {/* Bottom Section */}
//           {features.map((feature, idx) => (
//               key={idx}
//               className="bss-feature-item"
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ delay: idx * 0.1 }}
//             >
//           ))}
//   );
// export default BatteryServiceSelection;






import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';


const BatteryServiceSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { regNumber, mobileNumber, brand, model, fuel } = location.state || {
    regNumber: 'MH-12-AB-1234',
    mobileNumber: '',
    brand: 'HONDA',
    model: 'CITY',
    fuel: 'Petrol'
  };

  const [selectedInterval, setSelectedInterval] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedExtraParts, setSelectedExtraParts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const serviceIntervals = [
    '2 Months / 1500 Km',
    '1 Year / 10000 Km',
    '2 Year / 20000 Km',
    '3 Year / 30000 Km',
    '4 Year / 40000 Km',
    '5 Year / 50000 Km',
    '6 Year / 60000 Km',
    '7 Year / 70000 Km',
    '8 Year / 80000 Km',
    '9 Year / 90000 Km',
    '10 Year / 100000 Kms'
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get('/services');
        const data = response.data;
        
        const mappedPackages = data.map((pkg, index) => {
          let parsedParts = [];
          if (pkg.parts) {
            try { parsedParts = typeof pkg.parts === 'string' ? JSON.parse(pkg.parts) : pkg.parts; } catch(e) {}
          }
          return {
            id: pkg.id.toString(),
            title: pkg.name,
            desc: pkg.description || 'Comprehensive battery care with performance optimization.',
            price: pkg.price,
            oldPrice: Number(pkg.price) + Math.floor(Number(pkg.price) * 0.3),
            badge: 'Special Offer',
            popular: index === 1,
            includes: pkg.description ? pkg.description.split(',').map(s => s.trim()) : ['Standard Inspection', 'Voltage Test', 'Cleaning'],
            parts: parsedParts
          };
        });
        
        setPackages(mappedPackages);
        if (mappedPackages.length > 0) {
          setSelectedPackage(mappedPackages[0].id);
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const defaultPackages = [
    {
      id: 'Basic',
      title: 'Essential Battery Care',
      desc: 'Keep your battery healthy with professional inspection and terminal maintenance.',
      price: 499,
      oldPrice: 799,
      badge: '20% OFF',
      icon: <Battery size={28} />,
      includes: ['Battery Health Check', 'Terminal Cleaning', 'Voltage Test', 'Charging System Inspection', 'Water Level Check']
    },
    {
      id: 'Standard',
      title: 'Premium Battery Service',
      desc: 'Complete battery optimization with load testing and electrical system diagnostics.',
      price: 999,
      oldPrice: 1499,
      badge: '35% OFF',
      popular: true,
      icon: <Shield size={28} />,
      includes: ['Everything in Essential', 'Battery Charging', 'Load Test', 'Alternator Test', 'Electrical Connection Inspection']
    },
    {
      id: 'Premium',
      title: 'Elite Battery Protection',
      desc: 'Comprehensive care with doorstep support, jump start, and warranty assistance.',
      price: 1499,
      oldPrice: 2299,
      badge: '40% OFF',
      icon: <Award size={28} />,
      includes: ['Everything in Premium', 'Doorstep Installation', 'Jump Start Assistance', 'Battery Replacement Support', 'Warranty Assistance', 'Priority Service']
    }
  ];

  const displayPackages = packages.length > 0 ? packages : defaultPackages;

  useEffect(() => {
    setSelectedExtraParts([]);
  }, [selectedInterval]);



  const features = [
    { icon: <ShieldCheck size={20} />, text: 'Genuine Parts' },
    { icon: <Wrench size={20} />, text: 'Certified Technicians' },
    { icon: <TrendingUp size={20} />, text: 'Transparent Pricing' },
    { icon: <Clock size={20} />, text: 'Fast Service' },
    { icon: <Award size={20} />, text: 'Official Warranty' },
    { icon: <Star size={20} />, text: 'Expert Mechanics' },
    { icon: <Check size={20} />, text: 'Trusted by Thousands' }
  ];

  const individualServices = [
    { id: 's1', title: 'Battery Replacement', price: 299, icon: <Battery size={22} />, desc: 'Replace with premium quality battery' },
    { id: 's2', title: 'Battery Health Check', price: 199, icon: <Shield size={22} />, desc: 'Complete diagnostic checkup' },
    { id: 's3', title: 'Jump Start Service', price: 399, icon: <Zap size={22} />, desc: 'Emergency jump start assistance' },
    { id: 's4', title: 'Battery Charging', price: 249, icon: <Zap size={22} />, desc: 'Full charge with maintenance' },
    { id: 's5', title: 'Terminal Cleaning', price: 149, icon: <Wrench size={22} />, desc: 'Clean & protect terminals' },
    { id: 's6', title: 'Alternator Testing', price: 299, icon: <Settings size={22} />, desc: 'Alternator performance check' },
    { id: 's7', title: 'Warranty Assistance', price: 0, icon: <ShieldCheck size={22} />, freeText: 'Free', desc: 'Claim support & documentation' },
    { id: 's8', title: 'Doorstep Installation', price: 0, icon: <Truck size={22} />, freeText: 'Free', desc: 'Installation at your location' },
  ];

  const handleAddonToggle = (service) => {
    if (selectedAddons.find(a => a.id === service.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== service.id));
    } else {
      setSelectedAddons([...selectedAddons, service]);
    }
  };

  const currentParts = (() => {
    let adminParts = [];
    if (displayPackages && displayPackages.length > 0) {
      displayPackages.forEach(pkg => {
        let pkgIntervals = [];
        try {
          pkgIntervals = typeof pkg.parts === 'string' ? JSON.parse(pkg.parts) : (pkg.parts || []);
        } catch (e) {}

        let isDefaultForInterval = false;
        let is1500 = false;
        if (selectedInterval) {
          if (selectedInterval.includes('1500')) {
            is1500 = true;
          }
          const match = selectedInterval.match(/(\d+)\s*Km/i);
          if (match) {
            const kmStr = match[1];
            const kmNum = Number(kmStr);
            isDefaultForInterval = pkgIntervals.includes(kmNum) || pkgIntervals.includes(kmStr);
          }
        }

        adminParts.push({
          id: `admin-part-${pkg.id}`,
          name: pkg.title,
          basePrice: is1500 ? 0 : (Number(pkg.price) || 0),
          icon: '🔧',
          isDefault: isDefaultForInterval || is1500,
          isIncludedIn1500: is1500
        });
      });
    }
    return adminParts;
  })();

  const handleExtraPartToggle = (part) => {
    if (selectedExtraParts.find(p => p.id === part.id)) {
      setSelectedExtraParts(selectedExtraParts.filter(p => p.id !== part.id));
    } else {
      setSelectedExtraParts([...selectedExtraParts, part]);
    }
  };

  const getSubtotal = () => {
    const defaultPartsTotal = currentParts.filter(p => p.isDefault).reduce((sum, item) => sum + item.basePrice, 0);
    const extraPartsTotal = selectedExtraParts.reduce((sum, item) => sum + item.basePrice, 0);
    const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    return defaultPartsTotal + extraPartsTotal + addonsTotal;
  };

  const subtotal = getSubtotal();
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const formatPrice = (price) => `₹${price.toLocaleString()}`;

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  // Inline Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)',
      padding: '20px',
      paddingTop: '100px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 350px',
      gap: '28px',
      alignItems: 'start'
    },
    leftPane: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    rightPane: {
      position: 'sticky',
      top: '120px',
      zIndex: 10
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '4px'
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '10px 18px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151',
      transition: 'all 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    },
    headerBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 600,
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
    },
    titleSection: {
      marginTop: '8px'
    },
    mainTitle: {
      fontSize: '32px',
      fontWeight: 800,
      color: '#1e293b',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0',
      fontWeight: 400
    },
    packagesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    packageCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: '2px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    packageSelected: {
      borderColor: '#3b82f6',
      background: '#eff6ff',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
    },
    packageTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#1e293b'
    },
    packagePrice: {
      fontSize: '20px',
      fontWeight: 800,
      color: '#3b82f6'
    },
    packageDesc: {
      fontSize: '13px',
      color: '#64748b',
      lineHeight: '1.5'
    },
    sliderContainer: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px 28px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid rgba(226, 232, 240, 0.8)'
    },
    sliderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    sliderLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '16px',
      fontWeight: 600,
      color: '#1e293b'
    },
    sliderIndex: {
      fontSize: '13px',
      fontWeight: 500,
      color: '#94a3b8',
      background: '#f1f5f9',
      padding: '4px 12px',
      borderRadius: '12px'
    },
    sliderWrapper: {
      position: 'relative',
      padding: '4px 0'
    },
    slider: {
      width: '100%',
      height: '6px',
      borderRadius: '3px',
      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${selectedInterval ? (serviceIntervals.indexOf(selectedInterval) / (serviceIntervals.length - 1)) * 100 : 0}%, #e2e8f0 ${selectedInterval ? (serviceIntervals.indexOf(selectedInterval) / (serviceIntervals.length - 1)) * 100 : 0}%, #e2e8f0 100%)`,
      appearance: 'none',
      outline: 'none',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    sliderTicks: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: 500
    },
    partsSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px 28px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      overflow: 'hidden'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#1e293b',
      margin: 0
    },
    sectionBadge: {
      fontSize: '12px',
      fontWeight: 600,
      color: '#3b82f6',
      background: '#eff6ff',
      padding: '4px 12px',
      borderRadius: '12px'
    },
    tableWrapper: {
      overflowX: 'auto',
      marginTop: '4px'
    },
    partsTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
    tableHead: {
      backgroundColor: '#f8fafc',
      borderBottom: '2px solid #e2e8f0'
    },
    tableHeadCell: {
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: 600,
      color: '#475569',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    tableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background 0.2s'
    },
    activeRow: {
      backgroundColor: '#f8fafc'
    },
    tableCell: {
      padding: '12px 16px',
      color: '#334155'
    },
    partIcon: {
      marginRight: '10px'
    },
    partName: {
      fontWeight: 500
    },
    partPrice: {
      fontWeight: 600,
      color: '#0f172a'
    },
    partFree: {
      color: '#22c55e',
      fontWeight: 500
    },
    addonsSection: {
      marginTop: '8px'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '12px',
      marginTop: '16px'
    },
    serviceCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '2px solid #f1f5f9',
      cursor: 'pointer',
      transition: 'all 0.25s',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    },
    serviceSelected: {
      borderColor: '#3b82f6',
      background: '#f0f7ff',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
    },
    serviceIconWrapper: {
      position: 'relative',
      flexShrink: 0
    },
    serviceIcon: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: '#eff6ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#3b82f6'
    },
    serviceCheck: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      color: '#22c55e',
      background: 'white',
      borderRadius: '50%'
    },
    serviceInfo: {
      flex: 1,
      minWidth: 0
    },
    serviceTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#1e293b'
    },
    serviceDesc: {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '2px'
    },
    serviceAction: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
      flexShrink: 0
    },
    servicePrice: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#0f172a'
    },
    addonBtn: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      border: '2px solid #e2e8f0',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#64748b'
    },
    addonAdded: {
      background: '#3b82f6',
      borderColor: '#3b82f6',
      color: 'white'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    sidebarCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '20px 24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid rgba(226, 232, 240, 0.8)'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    sidebarTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#1e293b',
      margin: 0
    },
    vehicleBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#22c55e',
      background: '#f0fdf4',
      padding: '4px 12px',
      borderRadius: '12px'
    },
    badgeDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#22c55e',
      display: 'inline-block'
    },
    vehicleInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    vehicleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: '1px solid #f1f5f9'
    },
    vehicleLabel: {
      fontSize: '13px',
      color: '#94a3b8',
      fontWeight: 500
    },
    vehicleValue: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#1e293b'
    },
    warrantyRow: {
      borderBottom: 'none',
      paddingBottom: 0
    },
    warrantyActive: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#22c55e',
      fontSize: '13px'
    },
    summaryItems: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      color: '#475569'
    },
    summaryMain: {
      fontWeight: 600,
      color: '#1e293b',
      paddingBottom: '8px',
      borderBottom: '1px solid #f1f5f9'
    },
    summaryHighlight: {
      color: '#3b82f6',
      fontWeight: 700
    },
    summarySub: {
      fontSize: '13px',
      color: '#64748b',
      paddingLeft: '8px'
    },
    textFree: {
      color: '#22c55e',
      fontWeight: 600
    },
    summaryDivider: {
      borderTop: '1px dashed #e2e8f0',
      margin: '12px 0'
    },
    summaryTotals: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      paddingTop: '4px'
    },
    summaryGrand: {
      fontSize: '18px',
      fontWeight: 800,
      color: '#1e293b',
      borderTop: '2px solid #e2e8f0',
      paddingTop: '12px',
      marginTop: '4px'
    },
    summaryActions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '20px'
    },
    btnPrimary: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
      width: '100%'
    },
    btnOutline: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      background: 'white',
      color: '#475569',
      border: '2px solid #e2e8f0',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      width: '100%'
    },
    bottom: {
      maxWidth: '1440px',
      margin: '40px auto 0',
      background: 'white',
      borderRadius: '16px',
      padding: '32px 40px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid rgba(226, 232, 240, 0.8)'
    },
    bottomTitle: {
      textAlign: 'center',
      fontSize: '22px',
      fontWeight: 700,
      color: '#1e293b',
      margin: '0 0 24px 0'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px'
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      background: '#f8fafc',
      borderRadius: '10px',
      transition: 'all 0.2s'
    },
    featureIcon: {
      color: '#3b82f6',
      display: 'flex',
      alignItems: 'center'
    },
    featureText: {
      fontSize: '13px',
      fontWeight: 500,
      color: '#334155'
    }
  };

  // Slider thumb styles via style tag
  const sliderStyles = `
    .bss-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 0 0 4px #3b82f6, 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.15s;
    }
    .bss-slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }
    .bss-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 0 0 4px #3b82f6, 0 4px 12px rgba(0,0,0,0.15);
      border: none;
    }
    .bss-slider:focus {
      outline: none;
    }
    @media (max-width: 1150px) {
      .bss-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      .bss-right-pane { position: static !important; }
    }
    @media (max-width: 640px) {
      .bss-services-grid { grid-template-columns: 1fr !important; }
      .bss-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .bss-slider-container { padding: 16px !important; }
      .bss-parts-section { padding: 16px !important; }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{sliderStyles}</style>
      <div style={styles.main} className="bss-main-grid">
        {/* Left Pane */}
        <div style={styles.leftPane}>
          {/* Header */}
          <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

          </div>

          {/* Title */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            style={styles.titleSection}
          >
            <h1 style={styles.mainTitle}>Select Service Interval</h1>
            <p style={styles.subtitle}>Choose the right maintenance schedule for your vehicle's battery health</p>
          </motion.div>



          {/* Slider */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            style={styles.sliderContainer}
          >
            <div style={styles.sliderHeader}>
              <div style={styles.sliderLabel}>
                <Calendar size={18} />
                <span>{selectedInterval || 'Slide to select interval'}</span>
              </div>
              {selectedInterval && (
                <span style={styles.sliderIndex}>
                  {serviceIntervals.indexOf(selectedInterval) + 1} of {serviceIntervals.length}
                </span>
              )}
            </div>
            <div style={styles.sliderWrapper}>
              <input
                type="range"
                min="0"
                max={serviceIntervals.length - 1}
                step="1"
                value={selectedInterval ? serviceIntervals.indexOf(selectedInterval) : 0}
                onChange={(e) => setSelectedInterval(serviceIntervals[parseInt(e.target.value)])}
                style={styles.slider}
                className="bss-slider"
              />
              <div style={styles.sliderTicks}>
                <span>{serviceIntervals[0]}</span>
                <span>{serviceIntervals[Math.floor(serviceIntervals.length / 2)]}</span>
                <span>{serviceIntervals[serviceIntervals.length - 1]}</span>
              </div>
            </div>
          </motion.div>

          {/* Parts Table */}
          <AnimatePresence mode="wait">
            {(selectedInterval || selectedPackage) && (
              <motion.div
                key="parts-table"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                style={styles.partsSection}
              >
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Parts & Pricing Details</h2>
                  <span style={styles.sectionBadge}>{currentParts.length} items</span>
                </div>
                <div style={styles.tableWrapper}>
                  <table style={styles.partsTable}>
                    <thead style={styles.tableHead}>
                      <tr>
                        <th style={styles.tableHeadCell}>Component</th>
                        <th style={{ ...styles.tableHeadCell, textAlign: 'right' }}>Price (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentParts.map((part, idx) => {
                        const isExtraSelected = selectedExtraParts.some(p => p.id === part.id);
                        return (
                          <motion.tr
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            style={{ ...styles.tableRow, ...(part.isDefault || isExtraSelected ? styles.activeRow : {}) }}
                          >
                            <td style={styles.tableCell}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {!part.isIncludedIn1500 && !part.isDefault && (
                                  <input 
                                    type="checkbox" 
                                    checked={isExtraSelected}
                                    onChange={() => handleExtraPartToggle(part)}
                                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#3b82f6' }}
                                  />
                                )}
                                {(!part.isIncludedIn1500 && part.isDefault) && (
                                  <Check size={16} color="#22c55e" />
                                )}
                                <span style={styles.partIcon}>{part.icon}</span>
                                <span style={styles.partName}>{part.name}</span>
                              </div>
                            </td>
                            <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                              {part.isIncludedIn1500 ? (
                                <span style={styles.partFree}>Included</span>
                              ) : part.isDefault ? (
                                <span style={styles.partPrice}>{formatPrice(part.basePrice)}</span>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                  {!isExtraSelected && (
                                    <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Not Included</span>
                                  )}
                                  <span style={{ ...styles.partPrice, color: isExtraSelected ? '#3b82f6' : '#64748b' }}>
                                    {isExtraSelected ? formatPrice(part.basePrice) : `+ ${formatPrice(part.basePrice)}`}
                                  </span>
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add-ons */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            style={styles.addonsSection}
          >
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Add-on Services</h2>
              <span style={styles.sectionBadge}>{selectedAddons.length} selected</span>
            </div>
            <p style={styles.subtitle}>Enhance your service with these additional care options</p>

            <motion.div
              style={styles.servicesGrid}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bss-services-grid"
            >
              {individualServices.map((service, idx) => {
                const isSelected = selectedAddons.some(a => a.id === service.id);
                return (
                  <motion.div
                    key={service.id}
                    style={{ ...styles.serviceCard, ...(isSelected ? styles.serviceSelected : {}) }}
                    variants={fadeInUp}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => handleAddonToggle(service)}
                  >
                    <div style={styles.serviceIconWrapper}>
                      <div style={styles.serviceIcon}>{service.icon}</div>
                      {isSelected && <CircleCheck size={18} style={styles.serviceCheck} />}
                    </div>
                    <div style={styles.serviceInfo}>
                      <div style={styles.serviceTitle}>{service.title}</div>
                      <div style={styles.serviceDesc}>{service.desc}</div>
                    </div>
                    <div style={styles.serviceAction}>
                      <div style={styles.servicePrice}>
                        {service.freeText ? service.freeText : formatPrice(service.price)}
                      </div>
                      <button
                        style={{ ...styles.addonBtn, ...(isSelected ? styles.addonAdded : {}) }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddonToggle(service);
                        }}
                      >
                        {isSelected ? <Check size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div style={styles.rightPane} className="bss-right-pane">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.sidebar}
          >
            {/* Vehicle Details */}
            <div style={styles.sidebarCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.sidebarTitle}>Vehicle Details</h3>
                <div style={styles.vehicleBadge}>
                  <span style={styles.badgeDot}></span>
                  Active
                </div>
              </div>
              <div style={styles.vehicleInfo}>
                <div style={styles.vehicleRow}>
                  <span style={styles.vehicleLabel}>Registration</span>
                  <span style={styles.vehicleValue}>{regNumber}</span>
                </div>
                <div style={styles.vehicleRow}>
                  <span style={styles.vehicleLabel}>Brand</span>
                  <span style={styles.vehicleValue}>{brand}</span>
                </div>
                <div style={styles.vehicleRow}>
                  <span style={styles.vehicleLabel}>Model</span>
                  <span style={styles.vehicleValue}>{model}</span>
                </div>
                <div style={styles.vehicleRow}>
                  <span style={styles.vehicleLabel}>Fuel Type</span>
                  <span style={styles.vehicleValue}>{fuel}</span>
                </div>
                
              </div>
            </div>

            {/* Order Summary */}
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>Order Summary</h3>

              <div style={styles.summaryItems}>
                
                <div style={{ ...styles.summaryRow, ...styles.summaryMain }}>
                  <span>Service Interval</span>
                  <span style={styles.summaryHighlight}>
                    {selectedInterval || 'Not Selected'}
                  </span>
                </div>

                {currentParts.filter(p => p.isDefault).length > 0 ? (
                  currentParts.filter(p => p.isDefault).map((part, idx) => (
                    <div key={idx} style={{ ...styles.summaryRow, ...styles.summarySub }}>
                      <span>{part.icon} {part.name}</span>
                      <span>{formatPrice(part.basePrice)}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ ...styles.summaryRow, ...styles.summarySub }}>
                    <span>🔍 Basic Inspection</span>
                    <span style={styles.textFree}>Free</span>
                  </div>
                )}

                {selectedExtraParts.map((part, idx) => (
                  <div key={`extra-${idx}`} style={{ ...styles.summaryRow, ...styles.summarySub }}>
                    <span>{part.icon} {part.name} <span style={{color: '#3b82f6', fontSize: '11px'}}>(Added)</span></span>
                    <span>{formatPrice(part.basePrice)}</span>
                  </div>
                ))}

                {selectedAddons.length > 0 && (
                  <>
                    <div style={styles.summaryDivider}></div>
                    {selectedAddons.map(addon => (
                      <div key={addon.id} style={{ ...styles.summaryRow, ...styles.summarySub }}>
                        <span>{addon.icon} {addon.title}</span>
                        <span>{formatPrice(addon.price)}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={styles.summaryDivider}></div>

              <div style={styles.summaryTotals}>
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>GST (18%)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
                <div style={{ ...styles.summaryRow, ...styles.summaryGrand }}>
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div style={styles.summaryActions}>
                <motion.button
                  style={styles.btnPrimary}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!selectedInterval) {
                      alert("Please select a service interval first.");
                      return;
                    }
                    const partNames = currentParts.filter(p => p.price > 0).length > 0
                      ? 'Includes: ' + currentParts.filter(p => p.price > 0).map(p => p.name).join(', ')
                      : 'Basic Inspection';
                    const addonNames = selectedAddons.length > 0
                      ? ' | Addons: ' + selectedAddons.map(a => a.title).join(', ')
                      : '';
                    navigate('/garage-selection', {
                      state: {
                        vehicle: {
                          regNumber, brand, model, fuel,
                          batteryType: '12V 45Ah',
                          ownerName: location.state?.ownerName,
                          mobileNumber: location.state?.mobileNumber
                        },
                        package: {
                          name: `Service Interval: ${selectedInterval} (${partNames}${addonNames})`,
                          price: grandTotal
                        }
                      }
                    });
                  }}
                >
                  Select Garage
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section */}
      <motion.div
        style={styles.bottom}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 style={styles.bottomTitle}>Why Choose Us</h2>
        <div style={styles.featuresGrid} className="bss-features-grid">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              style={styles.featureItem}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <span style={styles.featureText}>{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BatteryServiceSelection;
