export default function ComingSoon() {
  return (
    <div className="bg-transparent shadow-none flex flex-col items-center justify-center p-0 mt-1">
      <svg className="text-[40px] text-[#BC6C25] mb-1 w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/>
      </svg>
      <p className="text-base text-[#BC6C25] font-semibold">
        추후 공개됩니다
      </p>
    </div>
  );
} 