import { MdOutlineAlternateEmail } from "react-icons/md";
import Phone from "@/components/Menu/components/Phone";
import BusinessHoursDisplay from "@/components/Menu/components/BusinessHoursDisplay";
import FoodDefault from "@/assets/default-food.jpg";
import { CiLocationOn } from "react-icons/ci";
import Image from "next/image";
import { Menu } from "@/types/api/Menu";
import { Montserrat } from "next/font/google";
import { FaLocationDot } from "react-icons/fa6";

type HeaderProps = {
  menu: Menu;
  color: string;
};

const montserrat = Montserrat({ weight: "900", subsets: ["latin"] });

export default function Header({ menu, color }: HeaderProps) {
  return (
    <header className="w-full flex flex-col justify-center items-center">
      <div className="w-full h-full">
        <div className="relative w-full pt-[33%] md:pt-[10%]">
          <Image
            src={menu.company.header || FoodDefault}
            alt={menu.company.name}
            fill
            quality={100}
            priority
            className="object-cover absolute inset-0 rounded-md"
          />
        </div>
      </div>
      <div className="flex gap-4 z-10 -mt-12 bg-white rounded-md border px-4 py-2 w-11/12 max-w-2xl">
        <div className="bg-white p-2 rounded-md min-w-28">
          <Image
            src={menu.company.image}
            alt={menu.company.name}
            width={100}
            height={100}
            quality={100}
            priority
          />
        </div>
        <div className="w-full flex flex-col justify-between">
          <div>
            <h1
              className="text-black text-lg font-bold -mb-1"
              style={montserrat.style}
            >
              {menu.company.name}
            </h1>
            {menu.company.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${menu.company.address.latitude},${menu.company.address.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row items-center gap-1 rounded-md text-sm mt-3"
              >
                <FaLocationDot size={17} color={color} />
                {menu.company.address.state} - {menu.company.address.city}
              </a>
            )}
            
            {/* Business Hours */}
            {menu.company.business_hours && menu.company.business_hours.length > 0 && (
              <BusinessHoursDisplay
                businessHours={menu.company.business_hours}
                color={color}
                className="mt-2"
              />
            )}
          </div>
          <address className="flex gap-2 text-black w-full items-center justify-end mt-2">
            {menu.company.email && (
              <a href={`mailto:${menu.company.email}`}>
                <MdOutlineAlternateEmail size={20} />
              </a>
            )}
            {menu.company.phone && <Phone phone={menu.company.phone} />}
          </address>
        </div>
      </div>
    </header>
  );
}
