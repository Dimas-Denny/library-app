import Logo from "@/assets/svg/logo.svg";
import Facebook from "@/assets/svg/facebook.svg";
import Instagram from "@/assets/svg/ig.svg";
import Linkedin from "@/assets/svg/linkedin.svg";
import Tiktok from "@/assets/svg/tiktok.svg";

export default function Footer() {
  return (
    <footer>
      <div
        className="
          mx-auto max-w-6xl
          px-4 md:px-16
          py-10 md:py-16
          text-center
        "
      >
        {/* Logo + Title */}
        <div className="flex items-center justify-center gap-2">
          <img src={Logo} alt="Booky" className="h-6 w-6" />
          <span className="text-xl font-semibold">Booky</span>
        </div>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-xl md:max-w-none text-sm font-semibold leading-relaxed md:whitespace-nowrap">
          Discover inspiring stories & timeless knowledge, ready to borrow
          anytime. Explore online or visit our nearest library branch.
        </p>

        {/* Social Title */}
        <h3 className="mt-6 text-sm font-semibold">Follow on Social Media</h3>

        {/* Social Icons */}
        <div className="mt-4 flex justify-center gap-4">
          {[Facebook, Instagram, Linkedin, Tiktok].map((Icon, index) => (
            <div
              key={index}
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full border border-black/10
                bg-white
                transition hover:bg-primary-100
              "
            >
              <img src={Icon} alt="Social" className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
