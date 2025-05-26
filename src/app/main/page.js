"use client"
import React from 'react';
import { App } from '@capacitor/app';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';


const features = [
  { title: 'Guest Booking', nav: '/guest-booking' },
  { title: 'Hotel', nav: '/hotel-booking' },
  { title: 'Expenses', nav: '/expenses' },
  { title: 'Itinerary Builder', nav: '/iteniarybuilder' },
  { title: 'Vehicle Master', nav: '/vehicle-master' },
  { title: 'Vehicle Agency Master', nav: '/vehicle-agency-master' },
  { title: 'Category Master', nav: '/category-master' },
];

const Home = () => {
  const router = useRouter()
  

  const pathname = usePathname();
  useEffect(() => {
    let listener;

    (async () => {
      listener = await App.addListener('backButton', () => {
        if (pathname !== '/') {
          router.back();
        } else {
          App.exitApp();
        }
      });
    })();

    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }, [pathname]);
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center pt-8">
      <header className="bg-blue-100 p-4 rounded-lg shadow-md mb-6 w-full">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </header>

      <div className="flex justify-left items-center flex-wrap gap-3 w-[357px]">
        {features.map((feature, index) => (
          <div
            onClick={() => router.push(feature.nav)}
            key={index}
            className="flex items-center flex-col bg-white border border-sky-500 rounded-lg shadow-sm hover:shadow-md transition duration-300"
          >
            <div className='flex items-center justify-center flex-col w-[170px] h-[80px]'>

              <div className="rounded-full"><Image src="/breakfast.svg" alt='img' width={40} height={30} /></div>
              <span className="text-gray-700 text-sm font-medium">{feature.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
