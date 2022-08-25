import { FunctionComponent } from "react";
import { AiFillGithub } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  return (
    <div className="bg-dark-lighten text-white flex justify-between items-center py-3 px-4 shadow-md mt-3">
      <p className="flex gap-2">
        <span>Copyright</span>
        <span className="hidden md:block"> &copy; 25/08/2022</span>
      </p>
      <div className="flex gap-3 items-center">
        <p className="hidden md:block">Contact me: </p>
        <div className="flex gap-2">
        <a
            href="https://hostiq.ua/clients/aff.php?aff=6281"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#6e5494] transition duration-300"
          >
            HOSTiQ
          </a>
          <a
            href="https://github.com/KolyaSotnichenko"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#6e5494] transition duration-300"
          >
            <AiFillGithub size={25} />
          </a>
          <a
            href="https://t.me/Kolya_Sotnichenko"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition duration-300"
          >
            <BsTelegram size={22} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
