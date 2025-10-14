"use client";

import React from "react";
import { Activity, BarChart3, Cpu, Globe, Server, Wifi } from "lucide-react";
import Image from "next/image";
import hetrixtoolslogo from "@/public/integrations/hetrix/icon 300 transparent cropped.png"
import updownLogo from "@/public/integrations/updown/square-logo.svg"
import Link from "next/link";

const integrations = [
  // {
  //   name: 'Uptime Robot',
  //   icon: <Activity className="w-8 h-8" />,
  //   description: 'Monitor your websites and get instant alerts when they go down.'
  // },
  {
    name: "HetrixTools",
    icon: <Image alt="hetrixtools logo" width={32} height={32} src={hetrixtoolslogo} />,
    description: "Automate incident creation/resolution using HetrixTools.",
  },
    {
      name: 'Updown.io',
      icon: <Image alt="updown.io logo" width={32} height={32} src={updownLogo} />,
      description: 'Automate incident creation/resolution using Updown.io.'
    },
  //   {
  //     name: 'Pingdom',
  //     icon: <Globe className="w-8 h-8" />,
  //     description: 'Website performance and availability monitoring from multiple locations.'
  //   },
    {
      name: 'StatusCake',
      icon: <Server className="w-8 h-8" />,
      description: 'Automate incident creation/resolution using Updown.io.'
    },
  {
    name: "Custom API",
    icon: <Cpu className="w-8 h-8" />,
    description:
      "Integrate with any monitoring service through our flexible API system.",
  },
];

export default function Integrations() {
  return (
    <section id="integrations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Works With Your Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ClearStatus integrates seamlessly with popular monitoring services.
            Connect your existing monitoring setup in minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:border-green-200 transition-all duration-300"
            >
              <div className="text-green-600 mb-6 group-hover:scale-110 transition-transform">
                {integration.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {integration.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {integration.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Don't see your monitoring service? We're constantly adding new
            integrations.
          </p>
          <Link href="https://tally.so/r/mZqq9o" target="_blank" rel="noopener">
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg">
              Request Integration
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
