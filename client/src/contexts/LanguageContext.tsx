import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

const translations: Translations = {
  // Header
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    mr: 'मुख्यपृष्ठ'
  },
  'nav.collections': {
    en: 'Collections',
    hi: 'संग्रह',
    mr: 'संग्रह'
  },
  'nav.necklaces': {
    en: 'Necklaces',
    hi: 'हार',
    mr: 'हार'
  },
  'nav.haras': {
    en: 'Haras',
    hi: 'हारा',
    mr: 'हारा'
  },
  'nav.mangalsutra': {
    en: 'Mangalsutra',
    hi: 'मंगलसूत्र',
    mr: 'मंगळसूत्र'
  },
  'nav.rings': {
    en: 'Rings',
    hi: 'अंगूठी',
    mr: 'अंगठी'
  },
  'nav.earrings': {
    en: 'Earrings',
    hi: 'कान की बाली',
    mr: 'कानातले'
  },
  'nav.bracelets': {
    en: 'Bracelets',
    hi: 'कंगन',
    mr: 'कंगण'
  },
  'nav.pooja-items': {
    en: 'Pooja Items',
    hi: 'पूजा सामग्री',
    mr: 'पूजा साहित्य'
  },
  'search.placeholder': {
    en: 'Search products...',
    hi: 'उत्पाद खोजें...',
    mr: 'उत्पादने शोधा...'
  },
  
  // Hero Section
  'hero.title': {
    en: 'Timeless Elegance in Gold & Silver',
    hi: 'सोने और चांदी में कालातीत लालित्य',
    mr: 'सोने आणि चांदीमध्ये कालातीत शोभा'
  },
  'hero.subtitle': {
    en: 'Discover our exquisite collection of handcrafted jewelry, where traditional artistry meets modern design.',
    hi: 'हमारे हस्तशिल्प आभूषणों के उत्कृष्ट संग्रह की खोज करें, जहां पारंपरिक कलाकारी आधुनिक डिजाइन से मिलती है।',
    mr: 'आमच्या हस्तकलेच्या दागिन्यांचा उत्कृष्ट संग्रह शोधा, जिथे पारंपारिक कलाकारी आधुनिक डिझाइनशी मिळते.'
  },
  'hero.explore': {
    en: 'Explore Collection',
    hi: 'संग्रह देखें',
    mr: 'संग्रह पहा'
  },
  'hero.appointment': {
    en: 'Book Appointment',
    hi: 'अपॉइंटमेंट बुक करें',
    mr: 'भेटीची वेळ बुक करा'
  },
  
  // Rates
  'rates.gold': {
    en: 'Gold (24K)',
    hi: 'सोना (24K)',
    mr: 'सोने (24K)'
  },
  'rates.silver': {
    en: 'Silver',
    hi: 'चांदी',
    mr: 'चांदी'
  },
  'rates.updated': {
    en: 'Updated',
    hi: 'अपडेट किया गया',
    mr: 'अपडेट केले'
  },
  
  // Product Details
  'product.weight': {
    en: 'Weight',
    hi: 'वजन',
    mr: 'वजन'
  },
  'product.purity': {
    en: 'Purity',
    hi: 'शुद्धता',
    mr: 'शुद्धता'
  },
  'product.material': {
    en: 'Material',
    hi: 'सामग्री',
    mr: 'साहित्य'
  },
  'product.category': {
    en: 'Category',
    hi: 'श्रेणी',
    mr: 'श्रेणी'
  },
  'product.region': {
    en: 'Region',
    hi: 'क्षेत्र',
    mr: 'प्रदेश'
  },
  'product.getQuote': {
    en: 'Get Quote',
    hi: 'कोटेशन प्राप्त करें',
    mr: 'कोटेशन मिळवा'
  },
  'product.callNow': {
    en: 'Call Now',
    hi: 'अभी कॉल करें',
    mr: 'आता कॉल करा'
  },
  'product.viewDetails': {
    en: 'View Details',
    hi: 'विवरण देखें',
    mr: 'तपशील पहा'
  },
  
  // Contact
  'contact.title': {
    en: 'Visit Our Store',
    hi: 'हमारी दुकान पर आएं',
    mr: 'आमच्या दुकानात या'
  },
  'contact.address': {
    en: 'Address',
    hi: 'पता',
    mr: 'पत्ता'
  },
  'contact.phone': {
    en: 'Phone',
    hi: 'फोन',
    mr: 'फोन'
  },
  'contact.hours': {
    en: 'Business Hours',
    hi: 'व्यापारिक घंटे',
    mr: 'व्यवसायाचे तास'
  },
  'contact.email': {
    en: 'Email',
    hi: 'ईमेल',
    mr: 'ईमेल'
  },
  
  // Chat
  'chat.title': {
    en: 'Live Chat',
    hi: 'लाइव चैट',
    mr: 'लाइव्ह चॅट'
  },
  'chat.subtitle': {
    en: "We're here to help!",
    hi: 'हम आपकी मदद के लिए यहाँ हैं!',
    mr: 'आम्ही मदतीसाठी येथे आहोत!'
  },
  'chat.placeholder': {
    en: 'Type your message...',
    hi: 'अपना संदेश टाइप करें...',
    mr: 'तुमचा संदेश टाइप करा...'
  },
  
  // Common
  'common.featured': {
    en: 'Featured',
    hi: 'विशेष',
    mr: 'वैशिष्ट्यीकृत'
  },
  'common.gold': {
    en: 'Gold',
    hi: 'सोना',
    mr: 'सोने'
  },
  'common.silver': {
    en: 'Silver',
    hi: 'चांदी',
    mr: 'चांदी'
  },
  'company.name': {
    en: 'Shree Jewellers',
    hi: 'श्री ज्वेलर्स',
    mr: 'श्री ज्वेलर्स'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}