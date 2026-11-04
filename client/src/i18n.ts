import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'BlueHorizon',
      tagline: 'See the Risk. Prepare Before It Happens.',
      statutoryNotice: 'Complements, does not replace, official warnings. Follow IMD, CWC, NDMA and your State Disaster Management Authority.',
      demoDataBadge: 'Demonstration data',
      hypotheticalNotice: 'Hypothetical scenario — not a forecast',
      riskLevels: {
        low: 'Low Risk',
        watch: 'Watch',
        elevated: 'Elevated Risk',
        high: 'High Danger'
      },
      nav: {
        home: 'Home',
        dashboard: 'Intelligence Dashboard',
        preparedness: 'Preparedness',
        simulator: 'What-If Simulator',
        community: 'Community Reports',
        admin: 'Admin Console',
        limitations: 'Limitations & Science'
      },
      freshness: {
        live: 'Live Telemetry',
        stale: 'Delayed Telemetry',
        degraded: 'Degraded Confidence'
      },
      roles: {
        citizen: 'Citizen',
        volunteer: 'Volunteer Responder',
        admin: 'System Administrator'
      }
    }
  },
  hi: {
    translation: {
      appName: 'ब्लूहॉराइजन',
      tagline: 'जोखिम को देखें। होने से पहले तैयार रहें।',
      statutoryNotice: 'यह आधिकारिक चेतावनियों का पूरक है, उनका स्थान नहीं लेता। आईएमडी (IMD), सीडब्ल्यूसी (CWC), एनडीएमए (NDMA) और अपने राज्य आपदा प्राधिकरण के निर्देशों का पालन करें।',
      demoDataBadge: 'प्रदर्शन डेटा (डेमो)',
      hypotheticalNotice: 'काल्पनिक परिदृश्य — यह आधिकारिक पूर्वानुमान नहीं है',
      riskLevels: {
        low: 'सामान्य (कम)',
        watch: 'निगरानी (वॉच)',
        elevated: 'बढ़ा हुआ जोखिम',
        high: 'उच्च खतरा'
      },
      nav: {
        home: 'मुख्य पृष्ठ',
        dashboard: 'डैशबोर्ड',
        preparedness: 'आपदा तैयारी',
        simulator: 'परिदृश्य सिम्युलेटर',
        community: 'सामुदायिक रिपोर्ट',
        admin: 'व्यवस्थापक कंसोल',
        limitations: 'सीमाएं और विज्ञान'
      },
      freshness: {
        live: 'सक्रिय डेटा',
        stale: 'विलंबित डेटा',
        degraded: 'निम्न विश्वसनीयता'
      },
      roles: {
        citizen: 'नागरिक',
        volunteer: 'स्वयंसेवक',
        admin: 'प्रशासक'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

