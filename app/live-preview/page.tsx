// @ts-nocheck
// Agency Modern 2026 (Nowoczesna Agencja Kreatywna) - Premium Template
"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Award, Box, CheckCircle2, Globe, Sparkles, X, Zap } from "lucide-react";

export default function AgencyModern() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
    }, 2000);
  };

  return (
    <div className="bg-zinc-950 text-white font-sans overflow-hidden w-full relative min-h-screen">
      {/* Glow Effect Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-4 pt-36 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-medium tracking-wide text-zinc-300">FUTURE OF DIGITAL EXPERIENCES</span>
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          We craft <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500">digital futures</span> through design.
        </motion.h1>

        <motion.p 
          className="text-zinc-500 max-w-xl text-base md:text-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          A full-service creative agency combining strategy, design, and top-tier code to scale your business.
        </motion.p>

        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-black font-bold uppercase tracking-wider text-sm rounded-xl transition-all shadow-[0_0_30px_#0ea5e9]/20 flex items-center gap-2 group"
          >
            Start A Project <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-transparent border border-zinc-800 hover:border-zinc-700 text-white font-medium text-sm rounded-xl transition-all">
            Our Work
          </button>
        </motion.div>
      </section>

      {/* Bento Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div 
            className="md:col-span-2 p-8 border border-zinc-900 bg-zinc-900/30 backdrop-blur-md rounded-2xl relative group overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px] group-hover:bg-purple-500/20 transition-all duration-500" />
            <Box className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Immersive Interfaces</h3>
            <p className="text-zinc-500 text-sm max-w-md">Creating spatial and 3D web immersive experiences that boost engagement and time-on-site for premium brands.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="p-8 border border-zinc-900 bg-zinc-900/30 backdrop-blur-md rounded-2xl flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="w-8 h-8 text-amber-500 mb-4" />
            <div>
               <h3 className="text-xl font-bold mb-2">Speed optimization</h3>
               <p className="text-zinc-500 text-sm">Under 1s load times scaling infrastructure on demand.</p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="p-8 border border-zinc-900 bg-zinc-900/30 backdrop-blur-md rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Globe className="w-8 h-8 text-sky-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Global edge</h3>
            <p className="text-zinc-500 text-sm">Distributed serverless infrastructure across global nodes.</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            className="md:col-span-2 p-8 border border-zinc-900 bg-zinc-900/30 backdrop-blur-md rounded-2xl relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Award className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Award Winning UI</h3>
            <div className="flex gap-4 mt-6">
               {['Awwwards', 'CSSDA', 'FWA'].map((award, i) => (
                  <div key={i} className="px-3 py-1 border border-zinc-800 rounded-lg text-xs text-zinc-400 bg-black/40">
                     {award} SOTD
                  </div>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsModalOpen(false); setFormStatus('idle'); }}
            />

            {/* Modal Content */}
            <motion.div 
              className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <button 
                onClick={() => { setIsModalOpen(false); setFormStatus('idle'); }}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Project Received!</h3>
                  <p className="text-zinc-400 text-sm">We'll get back to you in less than 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-1">Let's scale it.</h3>
                  <p className="text-zinc-500 text-sm mb-6">Brief us about your 2026 digital product goal.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="text-xs text-zinc-400 block mb-1">Project Name</label>
                        <input type="text" required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm focus:border-sky-500 outline-none transition-all" placeholder="Acme Inc." />
                     </div>
                     <div>
                        <label className="text-xs text-zinc-400 block mb-1">Budget Range</label>
                        <select className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300 focus:border-sky-500 outline-none">
                           <option>$5k - $10k</option>
                           <option>$10k - $25k</option>
                           <option>$25k+</option>
                        </select>
                     </div>
                     <button 
                        type="submit" 
                        disabled={formStatus === 'sending'}
                        className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-wider text-xs rounded-lg mt-2 flex justify-center items-center gap-2"
                     >
                        {formStatus === 'sending' ? 'Sending Brief...' : 'Submit Brief'}
                     </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer minimal */}
      <footer className="border-t border-zinc-900 py-10 text-center text-zinc-600 text-xs">
        © 2026 Agency Modern. All rights reserved. Precision & Code.
      </footer>
    </div>
  );
}
