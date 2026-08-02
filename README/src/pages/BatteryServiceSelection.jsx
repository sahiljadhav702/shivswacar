import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Battery, Shield, Award, ShieldCheck, Wrench, TrendingUp, Clock, Star, Check, Zap, Settings, Truck, ArrowLeft, Calendar, CircleCheck, Plus, ChevronRight, Wind, Circle, Paintbrush, Sparkles, Droplets, Search, Sun, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import './BatteryServiceSelection.css';

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
  const [activeTab, setActiveTab] = useState('interval');
  const [kmInput, setKmInput] = useState('');
  const [selectedPopupService, setSelectedPopupService] = useState(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [partsList, setPartsList] = useState([]);

  const serviceIntervals = ['2 Months / 1500 Km'];
  for (let i = 1; i <= 50; i++) {
    serviceIntervals.push(`${i} Year / ${i * 10000} Km`);
  }

  const handleKmInputChange = (e) => {
    const value = e.target.value;
    setKmInput(value);

    if (value && !isNaN(value)) {
      const numValue = parseInt(value, 10);
      let closestInterval = serviceIntervals[0];
      let minDiff = Infinity;

      serviceIntervals.forEach(interval => {
        const match = interval.match(/(\d+)\s*Kms?/i);
        if (match) {
          const intervalKm = parseInt(match[1], 10);
          const diff = Math.abs(intervalKm - numValue);
          if (diff < minDiff) {
            minDiff = diff;
            closestInterval = interval;
          }
        }
      });

      setSelectedInterval(closestInterval);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, packagesRes] = await Promise.all([
          api.get('/services'),
          api.get('/packages')
        ]);
        
        setPartsList(servicesRes.data || []);
        
        const mappedPackages = (packagesRes.data || []).map(pkg => {
          let parsedIncludes = [];
          try {
            parsedIncludes = typeof pkg.includes === 'string' ? JSON.parse(pkg.includes) : pkg.includes;
          } catch(e) {
            parsedIncludes = ['Standard Inspection'];
          }
          
          let iconComponent = <Wrench size={28} />;
          if (pkg.icon_type === 'Battery') iconComponent = <Battery size={28} />;
          if (pkg.icon_type === 'Shield') iconComponent = <Shield size={28} />;
          if (pkg.icon_type === 'Award') iconComponent = <Award size={28} />;
          if (pkg.icon_type === 'Zap') iconComponent = <Zap size={28} />;
          if (pkg.icon_type === 'Star') iconComponent = <Star size={28} />;

          return {
            id: pkg.id.toString(),
            title: pkg.title,
            desc: pkg.description,
            price: Number(pkg.price),
            oldPrice: pkg.oldPrice ? Number(pkg.oldPrice) : null,
            badge: pkg.badge,
            icon: iconComponent,
            includes: parsedIncludes,
            popular: pkg.popular === 1 || pkg.popular === true
          };
        });

        setPackages(mappedPackages);
        if (mappedPackages.length > 0) {
          setSelectedPackage(mappedPackages[0].id);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayPackages = packages;

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
    { id: 's1', title: 'Car Services', price: 1499, icon: <Wrench size={22} />, desc: 'General car service & maintenance' },
    { id: 's2', title: 'AC Service & Repair', price: 999, icon: <Wind size={22} />, desc: 'AC cooling & repair' },
    { id: 's3', title: 'Batteries', price: 2499, icon: <Battery size={22} />, desc: 'Replacement and health check' },
    { id: 's4', title: 'Tyres & Wheel Care', price: 499, icon: <Circle size={22} />, desc: 'Alignment, balancing & more' },
    { id: 's5', title: 'Denting & Painting', price: 1999, icon: <Paintbrush size={22} />, desc: 'Bodywork and color restoration' },
    { id: 's6', title: 'Detailing Services', price: 1299, icon: <Sparkles size={22} />, desc: 'Exterior & interior detailing' },
    { id: 's7', title: 'Car Spa & Cleaning', price: 599, icon: <Droplets size={22} />, desc: 'Deep cleaning and washing' },
    { id: 's8', title: 'Car Inspections', price: 499, icon: <Search size={22} />, desc: 'Comprehensive vehicle inspection' },
    { id: 's9', title: 'Windshields & Lights', price: 899, icon: <Sun size={22} />, desc: 'Glass repair & lighting check' },
    { id: 's10', title: 'Suspension & Fitments', price: 1599, icon: <Settings size={22} />, desc: 'Shock absorbers & fitments' },
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
    if (partsList && partsList.length > 0) {
      partsList.forEach(part => {
        let partIntervals = [];
        try {
          partIntervals = typeof part.parts === 'string' ? JSON.parse(part.parts) : (part.parts || []);
        } catch (e) { }

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
            isDefaultForInterval = partIntervals.includes(kmNum) || partIntervals.includes(kmStr);
          }
        }

        adminParts.push({
          id: `admin-part-${part.id}`,
          name: part.name,
          basePrice: is1500 ? 0 : (Number(part.price) || 0),
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
    const partsTotal = selectedInterval ? currentParts.reduce((sum, item) => sum + item.basePrice, 0) : 0;
    const addonsTotal = selectedAddons.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    return partsTotal + addonsTotal;
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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)',
      padding: '20px',
      paddingTop: '100px',
      fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif"
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
    titleSection: {
      marginTop: '8px'
    },
    mainTitle: {
      fontSize: '34px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0',
      fontWeight: 400
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
      background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
      borderRadius: '16px',
      padding: '18px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    },
    serviceSelected: {
      borderColor: '#3b82f6',
      background: 'linear-gradient(145deg, #eff6ff, #ffffff)',
      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1)'
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
    tabsContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      background: 'white',
      padding: '8px',
      borderRadius: '16px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
    },
    tabButton: {
      flex: 1,
      padding: '14px 20px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    activeTab: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
    },
    inactiveTab: {
      background: 'transparent',
      color: '#64748b'
    }
  };

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
    .bss-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .bss-modal-content { background: white; border-radius: 12px; padding: 24px; width: 100%; max-width: 850px; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .bss-pkg-box { display: flex; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; background: white; }
    .bss-pkg-img { width: 250px; flex-shrink: 0; background: #f8f8f8; }
    .bss-pkg-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }
    .bss-pkg-features { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; margin-bottom: 20px; }
    .bss-pkg-feature-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #444; }
    .bss-cart-row { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px dashed #eaeaea; }
    .bss-cart-price-col { display: flex; align-items: baseline; gap: 8px; }
    .bss-cart-btn { border: 1px solid #ef4444; color: #ef4444; background: white; padding: 10px 20px; font-weight: bold; border-radius: 4px; display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 14px; white-space: nowrap; }
    
    @media (max-width: 1150px) {
      .bss-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      .bss-right-pane { position: static !important; }
    }
    @media (max-width: 640px) {
      .bss-container { padding: 12px !important; padding-top: 80px !important; }
      .bss-services-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
      .bss-service-card { flex-direction: column !important; align-items: center !important; text-align: center !important; padding: 12px 8px !important; gap: 8px !important; }
      .bss-features-grid { grid-template-columns: 1fr !important; }
      .bss-slider-container { padding: 16px !important; }
      .bss-parts-section { padding: 16px !important; }
      .bss-modal-content { padding: 16px !important; }
      .bss-pkg-box { flex-direction: column !important; }
      .bss-pkg-img { width: 100% !important; height: 180px !important; }
      .bss-pkg-content { padding: 16px !important; }
      .bss-pkg-features { grid-template-columns: 1fr !important; }
      .bss-cart-row { flex-wrap: nowrap !important; gap: 8px !important; }
      .bss-cart-price-col { gap: 4px !important; flex-wrap: wrap !important; line-height: 1.2 !important; }
      .bss-cart-price-col span:first-child { font-size: 11px !important; }
      .bss-cart-price-col span:last-child { font-size: 16px !important; }
      .bss-cart-btn { padding: 6px 10px !important; font-size: 12px !important; flex-shrink: 0 !important; }
    }
  `;

  return (
    <div style={styles.container} className="bss-container">
      <style>{sliderStyles}</style>
      <div style={styles.main} className="bss-main-grid">
        <div style={styles.leftPane}>
          <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            style={styles.tabsContainer}
          >
            <button
              style={{ ...styles.tabButton, ...(activeTab === 'interval' ? styles.activeTab : styles.inactiveTab) }}
              onClick={() => setActiveTab('interval')}
            >
              Select Service Interval
            </button>
            <button
              style={{ ...styles.tabButton, ...(activeTab === 'addons' ? styles.activeTab : styles.inactiveTab) }}
              onClick={() => setActiveTab('addons')}
            >
              Add-on Services
            </button>
          </motion.div>

          {activeTab === 'interval' && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                style={styles.titleSection}
              >
                <h1 style={styles.mainTitle}>Select Service Interval</h1>
              </motion.div>

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

                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>Or enter kilometers:</span>
                  <input
                    type="number"
                    value={kmInput}
                    onChange={handleKmInputChange}
                    placeholder="e.g. 10000"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '14px',
                      width: '120px'
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>Km</span>
                </div>

                <div style={styles.sliderWrapper}>
                  <input
                    type="range"
                    min="0"
                    max={serviceIntervals.length - 1}
                    step="1"
                    value={selectedInterval ? serviceIntervals.indexOf(selectedInterval) : 0}
                    onChange={() => { }}
                    style={{ ...styles.slider, opacity: 0.7, cursor: 'not-allowed' }}
                    className="bss-slider"
                    disabled={true}
                  />
                  <div style={styles.sliderTicks}>
                    <span>{serviceIntervals[0]}</span>
                    <span>{serviceIntervals[Math.floor(serviceIntervals.length / 2)]}</span>
                    <span>{serviceIntervals[serviceIntervals.length - 1]}</span>
                  </div>
                </div>
              </motion.div>

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
                                    {(!part.isIncludedIn1500 && !part.isDefault) && (
                                      <div style={{ width: '16px', height: '16px' }} />
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
            </>
          )}

          {activeTab === 'addons' && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              style={styles.addonsSection}
            >


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
                      onClick={() => setSelectedPopupService(service)}
                      className="bss-service-card"
                    >
                      <div style={styles.serviceIconWrapper}>
                        <div style={styles.serviceIcon}>{service.icon}</div>
                        {isSelected && <CircleCheck size={18} style={styles.serviceCheck} />}
                      </div>
                      <div style={styles.serviceInfo}>
                        <div style={styles.serviceTitle}>{service.title}</div>
                        <div style={styles.serviceDesc}>{service.desc}</div>
                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </div>

        <div style={styles.rightPane} className="bss-right-pane">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.sidebar}
          >
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>Order Summary</h3>

              <div style={styles.summaryItems}>
                {selectedInterval && (
                  <>
                    <div style={{ ...styles.summaryRow, ...styles.summaryMain }}>
                      <span>Service Interval</span>
                      <span style={styles.summaryHighlight}>
                        {selectedInterval}
                      </span>
                    </div>
                    {kmInput && (
                      <div style={{ ...styles.summaryRow, ...styles.summaryMain, borderBottom: 'none', paddingBottom: '0' }}>
                        <span>Kilometers</span>
                        <span style={styles.summaryHighlight}>
                          {kmInput} Km
                        </span>
                      </div>
                    )}

                    {currentParts.length > 0 ? (
                      currentParts.map((part, idx) => (
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
                  </>
                )}

                {selectedAddons.length > 0 && selectedAddons.map((addon, idx) => (
                  <div key={`addon-${idx}`} style={{ ...styles.summaryRow, ...styles.summarySub }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#3b82f6' }}>➕</span>
                      <span>{addon.title}</span>
                    </div>
                    <span>{formatPrice(addon.price)}</span>
                  </div>
                ))}
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


      <AnimatePresence>
        {selectedPopupService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bss-modal-overlay"
            onClick={() => { setSelectedPopupService(null); setShowAllFeatures(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bss-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                onClick={() => { setSelectedPopupService(null); setShowAllFeatures(false); }}
              >
                <X size={24} />
              </button>

              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '12px', marginTop: 0 }}>Scheduled Packages</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="bss-pkg-box">
                  <div className="bss-pkg-img">
                    <img src="https://gomechanic.in/assets/img/customerpage/category/car-service.jpg" alt="Service" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div className="bss-pkg-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#222', margin: 0 }}>{selectedPopupService.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#4b5563' }}>
                        <Clock size={12} />
                        <span>4 Hrs Taken</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#666', marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <span>• 4 Hrs Taken</span>
                      <span>• 1000 Kms or 3 Months Warranty</span>
                      <span>• Every 5000 Kms or 6 Months (Recommended)</span>
                      <span>• Free Pick-up & Drop</span>
                    </div>

                    <div className="bss-pkg-features">
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Wiper Fluid Replacement</div>
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Battery Water Top Up</div>
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Car Wash</div>
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Interior Vacuuming (Carpet & Seats)</div>
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Engine Oil Replacement</div>
                      {showAllFeatures && (
                        <>
                          <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Oil Filter Replacement</div>
                          <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Coolant Top Up (200 ml)</div>
                          <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Air Filter Cleaning</div>
                          <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Heater/Spark Plugs Checking</div>
                        </>
                      )}
                      {!showAllFeatures && (
                        <div
                          style={{ color: '#22c55e', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center' }}
                          onClick={() => setShowAllFeatures(true)}
                        >
                          + 4 more View All
                        </div>
                      )}
                    </div>

                    <div className="bss-cart-row">
                      <div className="bss-cart-price-col">
                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>Rs. {Math.round(selectedPopupService.price * 1.3)}</span>
                        <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#111' }}>₹ {selectedPopupService.price}</span>
                      </div>
                      <button
                        className="bss-cart-btn"
                        onClick={() => {
                          handleAddonToggle(selectedPopupService);
                          setSelectedPopupService(null);
                          setShowAllFeatures(false);
                        }}
                      >
                        + ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bss-pkg-box">
                  <div className="bss-pkg-img">
                    <img src="https://gomechanic.in/assets/img/customerpage/category/car-service.jpg" alt="Front Brake Pads" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div className="bss-pkg-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#222', margin: 0 }}>Front Brake Pads</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#4b5563' }}>
                        <Clock size={12} />
                        <span>Takes 3 Hours</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#666', marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <span>• Takes 3 Hours</span>
                      <span>• 1 Month Warranty</span>
                      <span>• Every 20000 Kms or 12 Months (Recommended)</span>
                    </div>

                    <div className="bss-pkg-features">
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Opening & Fitting of Front Brake Pads</div>
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Front Brake Pads Replacement (OES)</div>
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Applicable for Set of 2 Front Brake Pads</div>
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Inspection of Front Brake Calipers</div>
                      <div className="bss-pkg-feature-item"><Check size={14} color="#22c55e" /> Prices are Estimated and Subject to Change Based on Part Availability</div>
                    </div>

                    <div className="bss-cart-row">
                      <div className="bss-cart-price-col">
                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>Rs. 2474</span>
                        <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#111' }}>₹ 1979</span>
                      </div>
                      <button
                        className="bss-cart-btn"
                        onClick={() => {
                          handleAddonToggle({ id: 'front-brake-pads', title: 'Front Brake Pads', price: 1979 });
                          setSelectedPopupService(null);
                          setShowAllFeatures(false);
                        }}
                      >
                        + ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BatteryServiceSelection;
