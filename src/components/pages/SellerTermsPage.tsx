// src/components/pages/SellerTermsPage.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaFileContract,
  FaCheckCircle,
  FaStore,
  FaBox,
  FaTruck,
  FaMoneyBillWave,
  FaShieldAlt,
  FaBan,
  FaExclamationTriangle,
  FaGavel,
  FaUserCheck,
  FaUndo,
  FaClock,
  FaEnvelope,
  FaWhatsapp,
} from 'react-icons/fa';

// ============================================================
// TERMS DATA
// ============================================================
interface TermSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  points: string[];
}

const TERMS_SECTIONS: TermSection[] = [
  {
    id: 'eligibility',
    icon: <FaUserCheck />,
    title: '1. Eligibility',
    points: [
      'You must be at least 18 years old and legally capable of entering into binding contracts.',
      'You must be a resident of Pakistan with a valid CNIC and NTN (if applicable).',
      'You must provide accurate, complete, and current information during registration.',
      'One person may operate only one seller account on MAHA ONE HYPERMARKET.',
      'Business entities must provide valid registration documents upon request.',
    ],
  },
  {
    id: 'account',
    icon: <FaStore />,
    title: '2. Seller Account',
    points: [
      'Your account is personal and non-transferable. You are responsible for all activity under your account.',
      'You must keep your login credentials confidential and notify us immediately of any unauthorized use.',
      'You are responsible for maintaining accurate store information, including store name, contact details, and business description.',
      'You may not impersonate another person, business, or brand.',
      'We reserve the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    id: 'products',
    icon: <FaBox />,
    title: '3. Product Listings',
    points: [
      'All products must be authentic, legally obtained, and accurately described.',
      'Product images, prices, descriptions, and specifications must be truthful and not misleading.',
      'You must not list counterfeit, stolen, or prohibited items.',
      'Prices must include all applicable taxes unless stated otherwise.',
      'We reserve the right to remove any listing that violates our policies without prior notice.',
      'Product approval: All new products are reviewed by admin before going live on the storefront.',
    ],
  },
  {
    id: 'prohibited',
    icon: <FaBan />,
    title: '4. Prohibited Items',
    points: [
      'Counterfeit or pirated goods.',
      'Illegal drugs, narcotics, or controlled substances.',
      'Weapons, ammunition, and explosives.',
      'Stolen goods or items obtained through illegal means.',
      'Adult content, obscene materials, or items violating Islamic values.',
      'Live animals or endangered species.',
      'Expired, spoiled, or unsafe food products.',
      'Items that infringe on intellectual property rights.',
    ],
  },
  {
    id: 'orders',
    icon: <FaTruck />,
    title: '5. Order Fulfillment',
    points: [
      'You must process and ship confirmed orders within 2 business days.',
      'All orders must be packed securely to prevent damage during transit.',
      'You must provide accurate tracking information when available.',
      'Orders must be shipped to the address provided by the customer only.',
      'Failure to fulfill orders may result in penalties, suspension, or account termination.',
      'You must respond to customer inquiries within 24 hours.',
    ],
  },
  {
    id: 'returns',
    icon: <FaUndo />,
    title: '6. Returns & Refunds',
    points: [
      'You must honor our 7-day return policy for eligible products.',
      'Returned items must be in original condition, unused, and with original packaging.',
      'You are responsible for refunding the customer within 3-5 business days after receiving the return.',
      'Shipping costs for returns due to seller error are your responsibility.',
      'Frequent returns due to product quality may result in account review.',
    ],
  },
  {
    id: 'commission',
    icon: <FaMoneyBillWave />,
    title: '7. Commission & Fees',
    points: [
      'MAHA ONE HYPERMARKET charges a standard commission of 10% on each completed sale.',
      'Commission rates may be adjusted with 30 days prior notice.',
      'Payment gateway fees and transaction charges are borne by MAHA ONE HYPERMARKET.',
      'All fees are exclusive of applicable government taxes.',
      'Commission is calculated on the final selling price (after discounts).',
    ],
  },
  {
    id: 'payouts',
    icon: <FaClock />,
    title: '8. Payments & Payouts',
    points: [
      'Earnings become available for withdrawal 7 days after order delivery.',
      'Payouts are processed weekly (every Monday) or upon request.',
      'Minimum withdrawal amount is PKR 5,000.',
      'Payouts are transferred to your registered bank account only.',
      'MAHA ONE HYPERMARKET is not responsible for delays caused by banks or payment processors.',
      'You are responsible for any taxes on your earnings as per Pakistani law.',
    ],
  },
  {
    id: 'ip',
    icon: <FaShieldAlt />,
    title: '9. Intellectual Property',
    points: [
      'You retain ownership of the content you upload (product images, descriptions).',
      'By uploading content, you grant MAHA ONE HYPERMARKET a non-exclusive, royalty-free license to display and promote your products.',
      'You must not upload content that infringes on third-party copyrights, trademarks, or patents.',
      'MAHA ONE HYPERMARKET trademarks, logos, and design elements may not be used without written permission.',
    ],
  },
  {
    id: 'conduct',
    icon: <FaExclamationTriangle />,
    title: '10. Seller Conduct',
    points: [
      'You must treat customers and MAHA ONE HYPERMARKET staff with respect.',
      'You may not manipulate reviews, ratings, or search rankings.',
      'You may not directly solicit customers to transact outside the platform.',
      'You may not misuse customer data for marketing without consent.',
      'You may not engage in fraudulent or deceptive practices.',
    ],
  },
  {
    id: 'suspension',
    icon: <FaBan />,
    title: '11. Suspension & Termination',
    points: [
      'We may suspend or terminate your account for violations of these terms.',
      'Reasons include: repeated order cancellations, poor ratings, counterfeit products, or fraud.',
      'Pending orders must be fulfilled even after termination notice.',
      'Any pending earnings will be paid out after deducting applicable penalties.',
      'You may appeal suspension decisions within 7 days by contacting support.',
    ],
  },
  {
    id: 'liability',
    icon: <FaGavel />,
    title: '12. Limitation of Liability',
    points: [
      'MAHA ONE HYPERMARKET acts as a marketplace and is not a party to transactions between you and customers.',
      'We are not liable for indirect, incidental, or consequential damages.',
      'Our total liability is limited to the commission earned on the disputed transaction.',
      'We do not guarantee uninterrupted or error-free platform access.',
      'We are not responsible for losses caused by events beyond our control (force majeure).',
    ],
  },
  {
    id: 'disputes',
    icon: <FaGavel />,
    title: '13. Dispute Resolution',
    points: [
      'Disputes between sellers and customers should first be resolved directly.',
      'If unresolved, MAHA ONE HYPERMARKET will mediate in good faith.',
      'Our decision on platform-related disputes is final and binding.',
      'Any legal disputes shall be governed by the laws of the Islamic Republic of Pakistan.',
      'Jurisdiction: Courts of Karachi, Sindh.',
    ],
  },
  {
    id: 'changes',
    icon: <FaFileContract />,
    title: '14. Changes to Terms',
    points: [
      'We reserve the right to modify these terms at any time.',
      'Material changes will be communicated via email or dashboard notification at least 7 days in advance.',
      'Continued use of the platform after changes constitutes acceptance.',
      'If you do not agree with updated terms, you may close your account.',
    ],
  },
  {
    id: 'contact',
    icon: <FaEnvelope />,
    title: '15. Contact',
    points: [
      'For questions about these terms, contact us at:',
      '📧 Email: mahaonehypermarket@gmail.com',
      '📱 WhatsApp: +92 303 3169725',
      '🕐 Business Hours: Monday - Saturday, 9 AM - 9 PM (PKT)',
    ],
  },
];

// ============================================================
// COMPONENT
// ============================================================
const SellerTermsPage: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = 'November 2025';

  return (
    <div className="min-h-screen bg-[#FFFDF7] dark:bg-[#111827]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#3B1E54] dark:hover:text-[#D4AF37] transition mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B1E54] to-[#5B2C6F] shadow-lg mb-5">
            <FaFileContract className="text-[#D4AF37] text-3xl" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-3">
            Seller Terms & Conditions
          </h1>

          <div className="h-1 w-20 mx-auto rounded-full bg-[#D4AF37] mb-4" />

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before registering as a seller on
            MAHA ONE HYPERMARKET.
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Last Updated: {lastUpdated}
          </p>
        </motion.div>

        {/* Intro Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            bg-gradient-to-br from-[#3B1E54]/5 to-[#D4AF37]/5
            border border-[#D4AF37]/20
            rounded-2xl p-5 sm:p-6 mb-8
          "
        >
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            These Terms & Conditions ("Terms") govern your use of the MAHA ONE
            HYPERMARKET seller platform. By registering as a seller, you agree
            to be bound by these Terms. If you do not agree, please do not
            register.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {TERMS_SECTIONS.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
              className="
                bg-white dark:bg-[#1F2937]
                rounded-2xl
                border border-gray-100 dark:border-gray-700
                shadow-sm
                overflow-hidden
              "
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 bg-gradient-to-r from-[#3B1E54]/5 to-transparent dark:from-[#3B1E54]/20 border-b border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 rounded-xl bg-[#3B1E54] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#D4AF37] text-lg">{section.icon}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>

              {/* Section Points */}
              <div className="p-5 sm:p-6">
                <ul className="space-y-3">
                  {section.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                      <FaCheckCircle className="text-[#D4AF37] text-sm mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Acceptance Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="
            mt-10
            bg-gradient-to-br from-[#3B1E54] to-[#5B2C6F]
            rounded-2xl
            p-6 sm:p-8
            text-white
            shadow-xl
          "
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="text-[#3B1E54] text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#D4AF37]">
                By Registering, You Agree
              </h3>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-4">
                Clicking "I Agree" or completing seller registration confirms
                that you have read, understood, and accepted all the terms
                outlined above.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/seller/register"
                  className="
                    inline-flex items-center justify-center gap-2
                    bg-[#D4AF37] hover:bg-white
                    text-[#3B1E54]
                    px-6 py-3 rounded-xl
                    font-bold text-sm sm:text-base
                    transition-all duration-300
                    shadow-md hover:shadow-lg
                  "
                >
                  <FaStore />
                  Proceed to Register
                </Link>

                <button
                  onClick={() => navigate(-1)}
                  className="
                    inline-flex items-center justify-center gap-2
                    bg-white/10 hover:bg-white/20
                    backdrop-blur
                    text-white
                    px-6 py-3 rounded-xl
                    font-medium text-sm sm:text-base
                    transition-all duration-300
                    border border-white/20
                  "
                >
                  <FaArrowLeft />
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">
            Questions about these terms?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:mahaonehypermarket@gmail.com"
              className="
                inline-flex items-center gap-2
                bg-white dark:bg-[#1F2937]
                border border-gray-200 dark:border-gray-700
                text-gray-700 dark:text-gray-300
                px-4 py-2 rounded-full
                text-xs sm:text-sm font-medium
                hover:border-[#D4AF37] hover:text-[#3B1E54]
                dark:hover:text-[#D4AF37]
                transition-all duration-300
              "
            >
              <FaEnvelope className="text-[#D4AF37]" />
              mahaonehypermarket@gmail.com
            </a>

            <a
              href="https://wa.me/923033169725"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                bg-white dark:bg-[#1F2937]
                border border-gray-200 dark:border-gray-700
                text-gray-700 dark:text-gray-300
                px-4 py-2 rounded-full
                text-xs sm:text-sm font-medium
                hover:border-[#25D366] hover:text-[#25D366]
                transition-all duration-300
              "
            >
              <FaWhatsapp className="text-[#25D366]" />
              +92 303 3169725
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} MAHA ONE HYPERMARKET. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerTermsPage;