"use client";

const announcements = [
  {
    id: 1,
    image: "/announcementbar/star.png",
    text: "Free Shipping Worldwide",
  },
  {
    id: 2,
    image: "/announcementbar/star.png",
    text: "Flat 50% OFF on New Collection",
  },
  {
    id: 3,
    image: "/announcementbar/star.png",
    text: "100% Secure Payments",
  },
  {
    id: 4,
    image: "/announcementbar/star.png",
    text: "24/7 Premium Customer Support",
  },
];

const marqueeItems = [...announcements, ...announcements, ...announcements];

export default function AnnouncementBar() {
  return (
    <div className="flex h-[46px] w-full items-center overflow-hidden bg-[#9372ff] md:h-[52px]">
      <div className="relative w-full overflow-hidden">
        <div className="animate-announcement-scroll">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex shrink-0 items-center gap-2.5 whitespace-nowrap px-[30px] md:gap-3 md:px-[50px]"
            >
              <img
                src={item.image}
                alt=""
                width={28}
                height={28}
                className="h-[22px] w-[22px] shrink-0 object-contain md:h-7 md:w-7"
              />
              <span className="text-[13px] font-medium tracking-wide text-white md:text-base">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
