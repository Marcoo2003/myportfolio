"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const folders = [
  {
    name: "fitness",
    icon: "📁",
    expanded: true,
    files: [
      { name: "workout_routine.md", desc: "Esecuzione" },
      { name: "progress.log", desc: "Progressi incrementali" },
    ],
  },
  {
    name: "books",
    icon: "📁",
    expanded: false,
    files: [
      { name: "psychology.pdf", desc: "Modelli mentali" },
      { name: "economics.epub", desc: "Come funziona il mondo" },
      { name: "physics.pdf", desc: "Dalla quantistica al cosmo" },
    ],
  },
  {
    name: "youtube",
    icon: "📁",
    expanded: false,
    files: [
      { name: "3blue1brown.url", desc: "Matematica visualizzata" },
      { name: "veritasium.url", desc: "Scienza raccontata bene" },
    ],
  },
];

const funFacts = [
  { label: "Editor", value: "VS Code" },
  { label: "Tema", value: "Dark mode" },
  { label: "Caffè/giorno", value: "≥ 3" },
  { label: "Tab vs Space", value: "Tab" },
];

export default function Identity() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["fitness"]);

  const toggleFolder = (name: string) => {
    setExpandedFolders(prev => 
      prev.includes(name) 
        ? prev.filter(f => f !== name)
        : [...prev, name]
    );
  };

  return (
    <section ref={ref} className="section">
      <div className="container">
        {/* Section label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="label mb-12 block"
        >
          03 // ABOUT ME
        </motion.span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-6 text-[var(--foreground)]">
              Non solo codice.
            </h2>
            
            <div className="space-y-4 text-[var(--foreground-muted)] leading-relaxed">
              <p>
                Credo che le migliori idee nascano quando esci dalla comfort zone. 
                Per questo alterno le ore davanti allo schermo con quelle in palestra — 
                stessa mentalità: costanza, progressi incrementali, zero scorciatoie.
              </p>
              <p>
                Mi piace capire come funzionano le cose. Divoro saggistica su qualsiasi 
                argomento, dai modelli mentali alla fisica quantistica. E quando non leggo, 
                probabilmente sto guardando qualche video di 3Blue1Brown cercando di 
                visualizzare concetti che sembravano impossibili.
              </p>
            </div>

            {/* Fun facts - terminal style */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
            >
              <div className="font-mono text-xs text-[#666] mb-3">$ cat fun_facts.json</div>
              <div className="font-mono text-xs space-y-1.5">
                {funFacts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex gap-2"
                  >
                    <span className="text-[#666]">"{fact.label}":</span>
                    <span className="text-[var(--foreground-muted)]">"{fact.value}"</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - File System Explorer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-lg overflow-hidden"
            style={{
              background: 'rgba(20,20,20,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Explorer header */}
            <div 
              className="flex items-center gap-3 px-4 py-3"
              style={{ 
                background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <span className="text-sm">📂</span>
              <span className="text-xs text-[var(--foreground-muted)]">~/interests</span>
              <span className="ml-auto text-[10px] text-[#555] font-mono">3 folders</span>
            </div>

            {/* File tree */}
            <div className="p-3">
              {folders.map((folder, folderIndex) => {
                const isExpanded = expandedFolders.includes(folder.name);
                
                return (
                  <motion.div
                    key={folder.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + folderIndex * 0.1 }}
                  >
                    {/* Folder row */}
                    <div 
                      onClick={() => toggleFolder(folder.name)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors group"
                    >
                      <motion.span 
                        className="text-[10px] text-[#555]"
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▶
                      </motion.span>
                      <span className="text-sm">{isExpanded ? '📂' : '📁'}</span>
                      <span className="text-xs text-[var(--foreground)] group-hover:text-white transition-colors">
                        {folder.name}
                      </span>
                      <span className="ml-auto text-[10px] text-[#444]">
                        {folder.files.length} items
                      </span>
                    </div>

                    {/* Files */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-5 border-l border-[rgba(255,255,255,0.06)] pl-2">
                        {folder.files.map((file, fileIndex) => (
                          <motion.div
                            key={file.name}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -5 }}
                            transition={{ duration: 0.2, delay: fileIndex * 0.05 }}
                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[rgba(255,255,255,0.03)] transition-colors group"
                          >
                            <span className="text-xs">
                              {file.name.endsWith('.md') ? '📝' : 
                               file.name.endsWith('.pdf') ? '📄' :
                               file.name.endsWith('.epub') ? '📖' :
                               file.name.endsWith('.log') ? '📋' :
                               file.name.endsWith('.url') ? '🔗' : '📄'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors block truncate">
                                {file.name}
                              </span>
                              <span className="text-[9px] text-[#555]">
                                {file.desc}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div 
              className="px-4 py-2 text-[10px] text-[#444] font-mono"
              style={{ 
                background: 'rgba(255,255,255,0.02)',
                borderTop: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <span className="text-[#555]">path:</span> ~/marco/interests
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
