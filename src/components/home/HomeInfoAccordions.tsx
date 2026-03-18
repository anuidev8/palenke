"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type AccordionItem = {
  title: string;
  description: string;
};

type HomeWhoWeAreAccordionProps = {
  introParagraphs: string[];
  strategicFunctionsIntro: string;
  strategicFunctions: AccordionItem[];
  strategicFunctionsClosing: string;
};

type HomePoliticalOrientationAccordionProps = {
  intro: string;
  lead: string;
  pillars: AccordionItem[];
};

function ItemAccordion({
  indexLabel,
  item,
  isOpen,
  onToggle,
}: {
  indexLabel?: string;
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="rounded-2xl border border-[#e8dfd3] bg-white/70">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-[#1a1a1a]">
          {indexLabel ? `${indexLabel} ` : ""}
          {item.title}
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-[#4a4540]" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-base leading-7 text-[#4a4540]">{item.description}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

export function HomeWhoWeAreAccordion({
  introParagraphs,
  strategicFunctionsIntro,
  strategicFunctions,
  strategicFunctionsClosing,
}: HomeWhoWeAreAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [openFunctionIndex, setOpenFunctionIndex] = useState<number | null>(0);

  const [firstParagraph, ...remainingParagraphs] = introParagraphs;

  return (
    <div className="space-y-5">
      <p className="text-base leading-8 text-[#4a4540]">{firstParagraph}</p>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333]"
        aria-expanded={expanded}
      >
        {expanded ? "Ver menos" : "Ver más"}
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="who-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 overflow-hidden"
          >
            {remainingParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-[#4a4540]">
                {paragraph}
              </p>
            ))}

            <p className="text-base leading-8 text-[#4a4540]">{strategicFunctionsIntro}</p>

            <ul className="space-y-3">
              {strategicFunctions.map((item, index) => (
                <ItemAccordion
                  key={item.title}
                  indexLabel={`${index + 1}.`}
                  item={item}
                  isOpen={openFunctionIndex === index}
                  onToggle={() =>
                    setOpenFunctionIndex((prev) => (prev === index ? null : index))
                  }
                />
              ))}
            </ul>

            <p className="text-base leading-8 text-[#4a4540]">{strategicFunctionsClosing}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function HomePoliticalOrientationAccordion({
  intro,
  lead,
  pillars,
}: HomePoliticalOrientationAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [openPillarIndex, setOpenPillarIndex] = useState<number | null>(0);

  return (
    <div className="space-y-5">
      <p className="text-base leading-7 text-[#4a4540]">{intro}</p>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333]"
        aria-expanded={expanded}
      >
        {expanded ? "Ver menos" : "Ver más"}
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="orientation-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 overflow-hidden"
          >
            <p className="text-base leading-7 text-[#4a4540]">{lead}</p>

            <ul className="space-y-3">
              {pillars.map((item, index) => (
                <ItemAccordion
                  key={item.title}
                  item={item}
                  isOpen={openPillarIndex === index}
                  onToggle={() => setOpenPillarIndex((prev) => (prev === index ? null : index))}
                />
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
