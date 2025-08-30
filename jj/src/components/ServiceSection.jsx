import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ServiceSection = () => {
  const { t } = useTranslation();
  const services = t("ServiceSection.services", { returnObjects: true }) || [];
  const sectionTitle = t("ServiceSection.sectionTitle"); // e.g. "Our Educational Programs"
  const sectionDescription = t("ServiceSection.sectionDescription"); // e.g. "Explore a variety of educational services designed to empower learners."

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* 📸 Image Side */}
        <div className="w-full">
          <div className="aspect-w-4 aspect-h-3 rounded-3xl overflow-hidden shadow-lg">
            <img
              src="/images/edu7.jpg" // Replace with your actual education-related image
              alt={t("imageAltText")} // e.g. "Students in a classroom"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* 📋 Services Info Side */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line">
            {sectionDescription}
          </p>

          <div className="space-y-4">
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service, idx) => (
                <Disclosure key={idx}>
                  {({ open }) => (
                    <div className="border border-blue-200 rounded-xl shadow-sm overflow-hidden">
                      {/* Title */}
                      <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left text-blue-800 font-semibold text-lg bg-blue-100 hover:bg-blue-200 transition">
                        <span className="flex items-center gap-2">
                          {service.icon} {service.title}
                        </span>
                        <motion.div
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDownIcon className="h-5 w-5 text-blue-700" />
                        </motion.div>
                      </Disclosure.Button>

                      {/* Animated Dropdown */}
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            key="content"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            style={{ originY: 0 }}
                            className="bg-white overflow-hidden"
                          >
                            <div className="px-4 py-4 text-gray-700 text-justify whitespace-pre-line">
                              {service.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </Disclosure>
              ))
            ) : (
              <p className="text-gray-500">{t("ServiceSection.noServices")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
