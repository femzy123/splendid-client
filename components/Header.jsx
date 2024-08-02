import Image from "next/image";

const Header = () => {
  return (
    <header className="px-6 sm:px-12 lg:px-36 bg-white flex flex-wrap items-center lg:py-3 py-2">
      <div className="flex-1 flex justify-between items-center logo">
        <a href="https://splendidpackaging.com/">
          <Image
            src="https://splendidpackaging.com/wp-content/uploads/2021/05/SPLENDID-PACKAGING-LOGO_edied-114x111.png"
            alt="Logo"
            width={80}
            height={100}
          />
        </a>
      </div>

      <label htmlFor="menu-toggle" className="pointer-cursor lg:hidden block">
        <svg
          className="fill-current text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <title>menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </label>
      <input className="hidden" type="checkbox" id="menu-toggle" />

      <div
        className="hidden lg:flex lg:items-center lg:w-auto w-full"
        id="menu"
      >
        <nav>
          <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
            <li>
              <a
                className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:text-green-600"
                href="https://splendidpackaging.com/"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:text-green-600"
                href="https://splendidpackaging.com/track-form/"
              >
                Live Tracking
              </a>
            </li>
            <li>
              <a
                className="lg:p-4 py-3 px-0 block border-b-2 border-transparent  hover:text-green-600"
                href="https://splendid-tracker-939ec.web.app/"
              >
                Vendor Tracking
              </a>
            </li>
            <li>
              <a
                className="lg:p-4 py-3 px-0 block border-b-2 border-transparent  hover:text-green-600"
                href="https://splendidpackaging.com/contact-us/"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header