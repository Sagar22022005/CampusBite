import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, MapPin } from 'lucide-react';

const HOSTELS = [
  'APJ Hostel',
  'CVR Hostel',
  'VSB Hostel',
  'DA Hostel',
  'HJB Hostel',
  'JC Bose Hostel',
  'LRC Complex',
  'Sports Complex',
  'Takshashila Complex',
  'Amul Parlour',
  'KV Complex',
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                Campus<span className="text-orange-500">Bite</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              The official campus food, grocery, and fresh fruit delivery platform built for IIT Indore students and staff. Get hot canteen meals delivered straight to your hostel doorsteps in minutes.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 w-fit px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              Direct @iiti.ac.in Verified Campus Network
            </div>
          </div>

          {/* Delivery Hostels */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" />
              Supported Delivery Hostels & Campus Locations
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {HOSTELS.map((hostel) => (
                <span
                  key={hostel}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {hostel}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} CampusBite — IIT Indore. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for campus foodies.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
