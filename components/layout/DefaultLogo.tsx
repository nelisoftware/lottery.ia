import Image from "next/image";

export default function DefaultLogo() {
  const imageLogo = '/logo.svg'; 
  return (
    <>
      <div className="flex items-center justify-start h-auto w-sideBar p-2 ml-2">
        <Image src={imageLogo} width={20} height={20} alt="" className="object-contain h-12 w-auto pl-2" priority/>
      </div>
    </>
  );
}