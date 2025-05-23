import {  SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function IHundredLogo() {
  return (
    <div className="w-full h-full px-4 flex justify-between items-center space-x-4">
            <SparklesIcon className="shrink-0 w-8 h-8 text-white-600" />
            <span className="text-xl font-bold tracking-wide">
                <span className="text-white-600">iHundred</span>
            </span>
  </div>
  );
}

