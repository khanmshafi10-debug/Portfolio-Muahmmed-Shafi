import React from 'react';
import { CounterStat } from './CounterStat';
import { Reveal } from './Reveal';

export const StatsSection: React.FC = () => {
  return (
    <section className="bg-[#18122B] text-[#F8FAFC] py-16 px-4 sm:px-6 md:px-10 border-t border-[#94A3B8]/20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <Reveal stagger={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <CounterStat end={26} suffix="+" label="GitHub Repositories" />
            <CounterStat end={3.71} decimals={2} label="Academic CGPA (CS)" />
            <CounterStat end={100} suffix="%" label="Client Delivery Rate" />
            <CounterStat end={21000} prefix="" suffix="+" label="Production Code Lines" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
